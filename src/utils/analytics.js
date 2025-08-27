import ReactGA from 'react-ga';
import TagManager from 'react-gtm-module';
import * as R from 'ramda';
import { analytics } from '../lib/settings';

const isDev = process.env.NODE_ENV === 'development';

const getIsGTMToken = () => !R.isEmpty(R.path(['CONFIG', 'gtmToken'], window));

export const getHasToken = () => {
  if (getIsGTMToken()) return true;
  return !R.isEmpty(R.path(['CONFIG', 'gaToken'], window));
};
//---------------------------------------------------------------------------------------initialize
export const initialize = ({ locale }) => {
  if (!getHasToken()) return;

  const { tagManagerArgs = {}, dataLayer = {} } = analytics;
  const gaToken = R.path(['CONFIG', 'gaToken'], window);
  const gtmToken = R.path(['CONFIG', 'gtmToken'], window);
  if (!R.isEmpty(gtmToken)) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.info(`google-tag-manager initialized with ${gtmToken}`);
    }
    TagManager.initialize({
      ...tagManagerArgs,
      gtmId: gtmToken,
      dataLayer: {
        ...dataLayer,
        event: 'page_view',
        site_name: window.location.host,
        site_environment: R.path(['CONFIG', 'siteEnv'], window),
        page_language: locale,
      },
    });
    return;
  }

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.info(`google-analytics initialized with ${gaToken}`);
  }
  ReactGA.initialize(gaToken, { debug: isDev });
  return;
};

// ---------------------------------------------------------------------------------------------lib
export const sendEvent = ({ dataLayer }) => {
  if (getIsGTMToken()) {
    return TagManager.dataLayer({
      dataLayer: R.omit(
        ['category', 'action', 'label', 'isGTMEvent'],
        dataLayer,
      ),
    });
  }
  if (R.prop('isGTMEvent', dataLayer)) return;
  // google analytics dont support gtm events
  ReactGA.event(dataLayer);
};
// ----------------------------------------------------------------------------------------------GA
export const joinDataflowIds = R.pipe(
  R.props(['datasourceId', 'dataflowId', 'agencyId', 'version']),
  R.map(R.replace(/@/g, '[at]')),
  R.join('/'),
);

// ---------------------------------------------------------------------------------------------GTM
export const joinConstraint = R.pipe(R.values, R.head, R.values, R.join(' - '));
