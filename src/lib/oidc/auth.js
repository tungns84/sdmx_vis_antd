import * as R from 'ramda';
import urljoin from 'url-join';
import axios from 'axios';
import { nanoid } from 'nanoid';
import { jws, crypto, hextob64u } from 'jsrsasign';

export let self;

const DEFAULT_CONFIG = {
  response_type: 'code',
  scope: 'openid',
  automaticSilentRenew: true,
};

class EventEmitter {
  constructor() {
    this.listeners = {};
  }

  on(type, cb) {
    if (!(type in this.listeners)) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(cb);
  }

  emit(event) {
    if (!(event.type in this.listeners)) return;
    const stack = this.listeners[event.type].slice();
    for (let i = 0, l = stack.length; i < l; i++) {
      stack[i].call(this, event);
    }
  }
}

class Oidc extends EventEmitter {
  constructor(options) {
    super();
    if (!this.isValidConfig(options)) throw new Error(`Invalid setup`);
    this.options = options;
  }

  get configurationUrl() {
    return urljoin(this.options.authority, '/.well-known/openid-configuration');
  }

  decodeState(state) {
    return state && JSON.parse(atob(state));
  }

  makeState() {
    const state = {
      srcUrl: window.location.href,
    };
    return btoa(JSON.stringify(state));
  }

  get authorizationUrl() {
    this.code_verifier = `${nanoid()}-${nanoid()}`;
    this.code_challenge = hextob64u(
      crypto.Util.hashString(this.code_verifier, 'SHA256'),
    );
    return urljoin(
      this.authConfig.authorization_endpoint,
      `?client_id=${this.options.client_id}`,
      `?scope=${this.options.scope}`,
      `?redirect_uri=${this.options.redirect_uri}`,
      `?response_type=${this.options.response_type}`,
      `?nonce=${nanoid()}`,
      `?code_challenge=${this.code_challenge}`,
      `?code_challenge_method=S256`,
      `?state=${this.makeState()}`,
    );
  }

  get endSessionUrl() {
    return urljoin(
      this.authConfig.end_session_endpoint,
      `?client_id=${this.options.client_id}`,
      `?id_token_hint=${this.tokens?.id_token}`,
    );
  }

  get endSessionUrlWithRedirect() {
    return urljoin(
      this.endSessionUrl,
      `&post_logout_redirect_uri=${this.options.post_logout_redirect_uri}`,
    );
  }

  async getOpenIdConfiguration() {
    try {
      const res = await axios.get(this.configurationUrl).then(R.prop('data'));
      this.emit({ type: 'configurationLoaded', config: this.authConfig });
      return res;
    } catch {
      throw new Error(
        `Cannot load openid configuration from ${this.configurationUrl}`,
      );
    }
  }

  async revoke(type) {
    const url = this.authConfig.revocation_endpoint;
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    const params = new URLSearchParams();
    params.append('client_id', this.options.client_id);
    params.append('token', this.tokens[type]);
    params.append('token_type_hint', type);

    try {
      await axios.post(url, params, config).then(R.prop('data'));
    } catch (err) {
      if (err.response?.data)
        return this.emit({ type: 'error', ...err.response.data });
      throw err;
    }
  }

  revokeAccessToken() {
    return this.revoke('access_token');
  }

  revokeRefreshToken() {
    return this.revoke('refresh_token');
  }

  registerLogout(delay) {
    if (!this.tokens) return;
    this.logoutTimer = setTimeout(
      () => this.signOut(),
      delay || this.tokens.expires_in * 1000,
    );
  }

  autoRefreshTokens() {
    if (!this.tokens) return;
    if (this.autoRefreshTimer) clearTimeout(this.autoRefreshTimer); // autoRefreshTimer can be called by a client
    this.autoRefreshTimer = setTimeout(
      () => this.refreshTokens(),
      this.tokens.expires_in * 1000 - 1000,
    );
  }

  async checkSession() {
    if (!this.tokens) return;
    const url = urljoin(
      this.authConfig.userinfo_endpoint,
      `?access_token=${this.tokens.access_token}`,
    );
    return axios.get(url);
  }

  manageSession(delay = 60 * 1000) {
    if (!this.tokens) return;
    setTimeout(() => {
      this.checkSession()
        .then(() => this.manageSession(delay))
        .catch(() => this.signOut());
    }, delay);
  }

  isValidConfig(config) {
    return config?.authority;
  }

  async getAccessTokenFromCode(code) {
    const params = new URLSearchParams();
    params.append('code', code);
    params.append('client_id', this.options.client_id);
    params.append('grant_type', 'authorization_code');
    params.append('redirect_uri', this.options.redirect_uri);
    params.append('code_verifier', this.code_verifier);
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    const url = this.authConfig.token_endpoint;
    try {
      this.tokens = await axios.post(url, params, config).then(R.prop('data'));
      const id_token = jws.JWS.parse(this.tokens.id_token);
      if (this.options.autoRefresh) this.autoRefreshTokens();
      this.emit({
        ...this.tokens,
        type: 'signedIn',
        payload: id_token.payloadObj,
      });
      return { ...this.tokens, payload: id_token.payloadObj };
    } catch (err) {
      if (err.response?.data)
        return this.emit({ type: 'error', ...err.response.data });
      throw err;
    }
  }

  async refreshTokens() {
    if (!this.tokens) return;
    const params = new URLSearchParams();
    params.append('client_id', this.options.client_id);
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', this.tokens.refresh_token);
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    const url = this.authConfig.token_endpoint;
    try {
      this.tokens = await axios.post(url, params, config).then(R.prop('data'));
      const id_token = jws.JWS.parse(this.tokens.id_token);
      if (this.options.autoRefresh) this.autoRefreshTokens();
      this.emit({
        ...this.tokens,
        type: 'tokensRefreshed',
        payload: id_token.payloadObj,
      });
      return { ...this.tokens, payload: id_token.payloadObj };
    } catch (err) {
      this.signOut();
      if (err.response?.data)
        return this.emit({ type: 'error', ...err.response.data });
      throw err;
    }
  }

  async signOut() {
    await this.endSession();
    // await this.revokeRefreshToken()
    this.tokens = null;
    this.logoutTimer = clearTimeout(this.logoutTimer);
    this.autoRefreshTimer = clearTimeout(this.autoRefreshTimer);
  }
}

class OidcIFrame extends Oidc {
  async signIn(params) {
    const options = R.mergeRight(this.options, params);
    try {
      if (!this.authConfig)
        this.authConfig = await this.getOpenIdConfiguration();
      let iframe;
      if (!options.frame) iframe = this.loginIframe;
      else {
        iframe = window.document.getElementById(options.frame);
        this.loginIframe = iframe;
      }
      if (!iframe) throw new Error(`Cannot get login iframe ${options.frame}`);
      iframe.src = this.authorizationUrl;
    } catch (err) {
      this.emit({
        type: 'error',
        error_description: err.message || err.toString(),
      });
    }
  }

  async endSession() {
    if (!this.tokens) return;
    let iframe = document.querySelector('iframe[id=logout-frame]');
    if (!iframe) {
      iframe = window.document.createElement('iframe');
      iframe.id = 'logout-frame';
      iframe.style =
        'position: absolute; width: 1px; height: 1px; inset: -9999px; display: none;';
      window.document.body.appendChild(iframe);
    }
    iframe.src = this.endSessionUrl;
  }
}

class OidcPopUp extends Oidc {
  async init() {
    try {
      if (!this.authConfig)
        this.authConfig = await this.getOpenIdConfiguration();
      this.emit({ type: 'configurationLoaded', config: this.authConfig });
    } catch (err) {
      this.emit({
        type: 'error',
        error_description: err.message || err.toString(),
      });
    }
  }

  async endSession() {
    try {
      if (!this.tokens) return;
      //await axios.get(this.endSessionUrlWithRedirect);
      //if (this.authConfig.revocation_endpoint) await this.revokeRefreshToken();
      //else await axios.get(this.endSessionUrlWithRedirect);
      this.emit({ type: 'signedOut' });
      window.location.replace(this.endSessionUrlWithRedirect);
    } catch (err) {
      this.emit({
        type: 'error',
        error_description: err.message || err.toString(),
      });
    }
  }
}

export const AuthIFrame = ({
  onSignIn,
  onSignOut,
  onAuthError,
  ...config
} = {}) => {
  let signInTimer;
  if (!self) {
    const oidc = new OidcIFrame(
      Object.assign({}, DEFAULT_CONFIG, config, {
        redirect_uri: config.redirect_uri,
        post_logout_redirect_uri: config.post_logout_redirect_uri,
      }),
    );
    if (onSignIn) oidc.on('signedIn', onSignIn);
    if (onSignOut) oidc.on('signedOut', onSignOut);
    if (onAuthError) oidc.on('error', onAuthError);
    window.onmessage = (e) => {
      if (e.origin === new URL(config.authority).origin) {
        switch (e.data.type) {
          case 'code':
            oidc.getAccessTokenFromCode(e.data.code);
            break;
          case 'signedOut':
            oidc.emit({ type: 'signedOut' });
            break;
          case 'session_not_found':
            oidc.emit({
              type: 'error',
              error: 'session_not_found',
              error_description: 'Session was expired, please sign in again',
            });
            if (signInTimer) clearTimeout(signInTimer);
            signInTimer = setTimeout(() => oidc.signIn(), 1000);
            break;
          default:
            oidc.emit({ ...e.data, type: 'error' });
        }
      }
    };
    self = oidc;
  }
  return self;
};

export const AuthPopUp = ({
  onSignIn,
  onSignOut,
  onAuthError,
  ...config
} = {}) => {
  if (!self) {
    const oidc = new OidcPopUp(
      Object.assign({}, DEFAULT_CONFIG, config, {
        redirect_uri: config.redirect_uri,
        post_logout_redirect_uri: config.post_logout_redirect_uri,
      }),
    );
    if (onSignIn) oidc.on('signedIn', onSignIn);
    if (onSignOut) oidc.on('signedOut', onSignOut);
    if (onAuthError) oidc.on('error', onAuthError);
    self = oidc;
  }
  return self;
};
