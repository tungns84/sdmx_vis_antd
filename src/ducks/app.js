import * as R from 'ramda';
import {
  HANDLE_EXTERNAL_REFERENCE,
  HANDLE_AVAILABLE_TIME_PERIOD,
  HANDLE_DATA,
  HANDLE_STRUCTURE,
  RESET_DATAFLOW,
  CHANGE_DATAFLOW,
} from './sdmx';
import { setLocale } from '../i18n';
import { getPathname } from '../selectors/router';
import { ROUTER_ON_LOCATION_CHANGED } from '@lagunovsky/redux-react-router';
import { RESET_SEARCH } from './search';

//------------------------------------------------------------------------------constants
export const LOG_ERROR = 'LOG_ERROR';
export const LOG_ERROR_VIS_CSV_DL = 'LOG_ERROR_VIS_CSV_DL';

//----------------------------------------------------------------------------------model
export const model = () => ({
  appBarsOffset: 0,
  visPageWidth: 0,
  extAuthOptions: {},
  logs: [],
  pending: {},
  token: undefined,
  user: undefined,
  isFirstRendering: true,
  queryKeys: {},
});

//--------------------------------------------------------------------------------actions
export const PUSH_LOG = '@@app/PUSH_LOG';
export const FLUSH_LOG = '@@app/FLUSH_LOG';
export const SET_PENDING = '@@app/SET_PENDING';
export const CHANGE_HAS_ACCESSIBILITY = '@@app/CHANGE_HAS_ACCESSIBILITY';
export const CHANGE_LOCALE = '@@app/CHANGE_LOCALE';
export const USER_SIGNED_IN = '@@app/USER_SIGNED_IN';
export const USER_SIGNED_OUT = '@@app/USER_SIGNED_OUT';
export const REFRESH_TOKEN = '@@app/REFRESH_TOKEN';
export const SET_EXT_AUTH_OPTIONS = '@@app/SET_EXT_AUTH_OPTIONS';
export const FAILED_EXT_AUTH = '@@app/FAILED_EXT_AUTH';
export const UPDATE_APP_BARS_OFFSET = '@@app/UPDATE_APP_BARS_OFFSET';
export const UPDATE_VIS_PAGE_WIDTH = '@@app/UPDATE_VIS_PAGE_WIDTH';

//-------------------------------------------------------------------------------creators
export const updateAppBarsOffset = (offset) => ({
  type: UPDATE_APP_BARS_OFFSET,
  payload: { offset },
});
export const updateVisPageWidth = (width) => ({
  type: UPDATE_VIS_PAGE_WIDTH,
  payload: { width },
});
export const pushLog = (log) => ({ type: PUSH_LOG, payload: { log } });
export const flushLog = (type) => ({ type: FLUSH_LOG, payload: { type } });

export const setPending = (id, is) => ({
  type: SET_PENDING,
  payload: { id, is },
});

export const changeHasAccessibility = (hasAccessibility) => ({
  type: CHANGE_HAS_ACCESSIBILITY,
  pushHistory: { payload: { hasAccessibility } },
});

export const setExtAuthOptions = (id, options) => ({
  type: SET_EXT_AUTH_OPTIONS,
  payload: { id, options },
});
export const failedExtAuth = (id) => ({
  type: FAILED_EXT_AUTH,
  payload: { id },
});

export const changeLocale = (locale) => (dispatch) => {
  setLocale(locale);
  dispatch({
    type: CHANGE_LOCALE,
    pushHistory: {
      payload: {
        locale,
        term: '',
        start: 0,
        constraints: null,
        facet: null,
        highlightedConstraints: null,
      },
    },
  });
};

// on sign(in/out), requests that are impacted by auth should be re-fetched
// search is public, no need to re-fetch anything
// (reminder, the popup auth flow doesn't rely on redirect!)
// so far, only SDMX requests are concerned and they are triggered only under /vis route
// in order to avoid having a saga or a middleware for only 2 actions
// the behavior is implemented here
const getRequest = (getState) =>
  getPathname(getState()) === '/vis' ? 'getStructure' : 'getNothing';
export const userSignedIn = (token, user) => (dispatch, getState) => {
  dispatch({
    type: USER_SIGNED_IN,
    token,
    user,
    request: getRequest(getState),
  });
};
export const userSignedOut = () => (dispatch, getState) => {
  dispatch({ type: USER_SIGNED_OUT, request: getRequest(getState) });
};
export const refreshToken = (token) => ({ type: REFRESH_TOKEN, token });

//--------------------------------------------------------------------------------reducer
export default (state = model(), action = {}) => {
  switch (action.type) {
    case UPDATE_APP_BARS_OFFSET:
      return R.set(R.lensProp('appBarsOffset'), action.payload.offset, state);
    case UPDATE_VIS_PAGE_WIDTH:
      return R.set(R.lensProp('visPageWidth'), action.payload.width, state);
    case PUSH_LOG:
      return R.over(R.lensProp('logs'), R.prepend(action.payload.log), state);
    case FLUSH_LOG:
      return R.over(
        R.lensProp('logs'),
        R.reject(R.propEq(action.payload.type, 'type')),
        state,
      );
    case SET_PENDING:
      return R.assocPath(
        ['pending', action.payload.id],
        action.payload.is,
        state,
      );
    case USER_SIGNED_IN:
      return { ...state, token: action.token, user: action.user };
    case USER_SIGNED_OUT:
      return { ...state, user: null, token: null };
    case REFRESH_TOKEN:
      return { ...state, token: action.token };
    case SET_EXT_AUTH_OPTIONS:
      return R.set(
        R.lensPath(['extAuthOptions', action.payload.id]),
        {
          isAnonymous: action.payload.options.isAnonymous,
          credentials: action.payload.options.isAnonymous
            ? null
            : btoa(
                `${action.payload.options.user}: ${action.payload.options.password}`,
              ),
        },
        state,
      );
    case FAILED_EXT_AUTH:
      return R.set(
        R.lensPath(['extAuthOptions', action.payload.id, 'hasFailed']),
        true,
        state,
      );
    case RESET_SEARCH:
    case RESET_DATAFLOW:
      return { ...state, queryKeys: {}, logs: [] };
    case HANDLE_STRUCTURE:
    case HANDLE_DATA:
    case HANDLE_AVAILABLE_TIME_PERIOD:
    case HANDLE_EXTERNAL_REFERENCE:
      return R.set(
        R.lensPath(['queryKeys', action.type]),
        action.queryKey,
        state,
      );
    case CHANGE_DATAFLOW:
      return { ...state, queryKeys: [] };
    case ROUTER_ON_LOCATION_CHANGED:
      return { ...state, isFirstRendering: action.isFirstRendering };
    default:
      return state;
  }
};
