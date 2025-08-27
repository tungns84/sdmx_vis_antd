import { Provider } from 'react-redux';
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import * as R from 'ramda';
import 'antd/dist/reset.css';
import { getLocale } from './selectors/router';
import configureStore, { history } from './configureStore';
import { I18nProvider, initialize as initializeI18n } from './i18n';
import { initialize as initializeAnalytics } from './utils/analytics';
import { ThemeProvider } from './theme';
import searchApi from './api/search';
import shareApi from './api/share';
import { search, i18n, theme } from './lib/settings/index-simple';
import ErrorBoundary from './components/error-boundary';
import Helmet from './components/helmet';
import meta from '../package.json';
// Auth disabled
// import { AuthPopUp as Auth } from './lib/oidc/auth';
// import { OidcProvider } from './lib/oidc';
import { userSignedIn, userSignedOut, refreshToken } from './ducks/app';
import { getIsFirstRendering } from './selectors/app.js';
import { QueryCache, QueryClient, QueryClientProvider } from 'react-query';
import ReactLazy from 'react';
import { ReactQueryDevtools } from 'react-query/devtools';
import {
  Route,
  Routes,
  //createRoutesFromChildren,
  //matchRoutes,
  //useLocation,
  //useNavigationType,
} from 'react-router';
import App from './components/app';
import { ReduxRouter } from '@lagunovsky/redux-react-router';
import Search from './components/search';
import Vis from './components/vis';
import NotFound from './components/not-found';
import Share from './share';
import StyledEngineProvider from '@mui/material/StyledEngineProvider';
import * as Sentry from '@sentry/react';

console.info(`${meta.name}@${meta.version}`); // eslint-disable-line no-console

const initSentry = () => {
  if (R.isNil(window.CONFIG.sentryDSN)) return;

  Sentry.init({
    dsn: window.CONFIG.sentryDSN,
    environment: window.CONFIG.sentryEnv,
    release: window.CONFIG.sentryRelease,
    integrations: [
      Sentry.browserTracingIntegration(),
      //Sentry.reactRouterV7BrowserTracingIntegration({
      //  useEffect: React.useEffect,
      //  //useLocation,
      //  //useNavigationType,
      //  createRoutesFromChildren,
      //  matchRoutes,
      //}),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
};

const initQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: false,
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
      },
    },
    queryCache: new QueryCache({
      onSuccess: (data, query) => {
        if (!R.is(Function, query?.meta?.successHandler)) return;
        query.meta.successHandler({ data, queryKey: query.meta.queryKey });
      },
      onError: (error, query) => {
        if (!R.is(Function, query?.meta?.errorHandler)) return;
        /* if (error.code === 'E_JSON_PARSE' && R.isNil(spaceId)) {
          // redirect to invalid page with proper arg (ie invalid space)
          // when router will be full setup
        }*/
        query.meta.errorHandler({ error, queryKey: query.meta.queryKey });
        /*if (error?.response?.status === 401 && hasExternalAuth)
          dispatch(failedExtAuth(spaceId)); */
      },
    }),
  });
};

// Auth disabled
const initAuth = () => null;

const run = async () => {
  const initialState = {};

  initSentry();
  const queryClient = initQueryClient();
  const store = configureStore(initialState);
  const auth = initAuth(window.CONFIG?.member?.scope?.oidc, store);
  const locale = getLocale(store.getState());

  searchApi.setConfig(search);
  shareApi.setConfig(window.SETTINGS?.share);
  // Use 'en' as default locale if not specified
  const finalLocale = locale || 'en';
  initializeI18n(i18n, finalLocale);

  const container = document.getElementById('root');
  const root = createRoot(container);

  //const SentryRoutes = Sentry.withSentryReactRouterV7Routing(Routes);

  const CleanDemo = React.lazy(() => import('./components/clean-demo.tsx'));

  const render = (finalLocale) => {
    if (!getIsFirstRendering(store.getState())) return;
    initializeAnalytics({ locale: finalLocale });

    root.render(
      <StrictMode>
        <ErrorBoundary>
          <Provider store={store}>
            {/* OidcProvider disabled */}
              <StyledEngineProvider injectFirst>
                <ThemeProvider theme={theme}>
                  <I18nProvider messages={window.I18N || {}} locale={finalLocale}>
                    <ErrorBoundary>
                      <Helmet />
                      {/* MUI CssBaseline removed; AntD reset is imported globally */}
                      <ReduxRouter history={history}>
                        <QueryClientProvider client={queryClient}>
                          <App>
                            <React.Suspense fallback={null}>
                              <Routes>
                                <Route path="/" element={<CleanDemo />} />
                                <Route path="/search" element={<Search />} />
                                <Route path="/vis" element={<Vis />} />
                                <Route path="/share" element={<Share />} />
                                <Route path="*" element={<NotFound />} />
                              </Routes>
                            </React.Suspense>
                          </App>
                          <ReactQueryDevtools initialIsOpen={true} />
                        </QueryClientProvider>
                      </ReduxRouter>
                    </ErrorBoundary>
                  </I18nProvider>
                </ThemeProvider>
              </StyledEngineProvider>
            {/* OidcProvider disabled */}
          </Provider>
        </ErrorBoundary>
      </StrictMode>,
    );
  };

  // Auth disabled - just render directly
  render(finalLocale);
};

run();
