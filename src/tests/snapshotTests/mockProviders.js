import { Provider } from 'react-redux';
import React, { StrictMode } from 'react';
import { render, renderHook } from '@testing-library/react';
import CssBaseline from '@mui/material/CssBaseline';
import configureStore from '../../configureStore';
import { ThemeProvider } from '../../theme';
import ErrorBoundary from '../../components/error-boundary';
import Helmet from '../../components/helmet';
import { OidcProvider } from '../../lib/oidc';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import App from '../../components/app';
import { ReduxRouter } from '@lagunovsky/redux-react-router';
import { createBrowserHistory } from 'history';
import enMsg from '../../../mocks/config/i18n/en.json';
import { IntlProvider } from 'react-intl';
import StyledEngineProvider from '@mui/material/StyledEngineProvider';
import 'mutationobserver-shim';
import { theme as defaultTheme } from '../../lib/settings';

// import { MemoryRouter } from 'react-router-dom';
const messages = {
  en: enMsg,
};

const initialState = {};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: false,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    },
  },
});
const initialStore = configureStore(initialState);
const auth = {};
const history = createBrowserHistory();
const theme = {
  ...defaultTheme,
  breakpoints: {
    xs: 120,
    xs2: 250,
    xs3: 270,
    sm: 370,
    md: 420,
    md2: 560,
    lg: 760,
    xl: 855,
  },
};

const MockProvider =
  ({ store = initialStore, locale = 'en' } = {}) =>
  ({ children }) => (
    <StrictMode>
      <ErrorBoundary>
        <Provider store={store}>
          <OidcProvider value={auth}>
            <StyledEngineProvider injectFirst>
              <ThemeProvider theme={theme}>
                <IntlProvider
                  locale={locale}
                  key={locale}
                  messages={messages[locale]}
                >
                  <ErrorBoundary>
                    <Helmet />
                    <CssBaseline />
                    <ReduxRouter history={history}>
                      <QueryClientProvider client={queryClient}>
                        <App>{children}</App>
                        <ReactQueryDevtools initialIsOpen={true} />
                      </QueryClientProvider>
                    </ReduxRouter>
                  </ErrorBoundary>
                </IntlProvider>
              </ThemeProvider>
            </StyledEngineProvider>
          </OidcProvider>
        </Provider>
      </ErrorBoundary>
    </StrictMode>
  );

export const customRender = (ui, options) =>
  render(ui, { wrapper: MockProvider(options), options });
// re-export everything
export * from '@testing-library/react';
export { customRender as render };

export const customRenderHook = (hook, options) =>
  renderHook(hook, { wrapper: MockProvider(options), options });
export { customRenderHook as renderHook };
