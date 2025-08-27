import { createBrowserHistory } from 'history';
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { createRouterMiddleware } from '@lagunovsky/redux-react-router';
import createRootReducer from './reducers';
import { getHasToken } from './utils/analytics';
import { historyMiddleware } from './middlewares/history';
import { analyticsMiddleware } from './middlewares/analytics';
import { sdmxMiddleware } from './middlewares/sdmx';

//const isDev = process.env.NODE_ENV === 'development';

const isInBrowser = typeof window !== 'undefined';
export const history = isInBrowser ? createBrowserHistory() : {};

export default (initialState) => {
  const composeEnhancer =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const middlewares = [
    thunk,
    sdmxMiddleware,
    historyMiddleware,
    createRouterMiddleware(history),
  ];

  if (getHasToken()) middlewares.push(analyticsMiddleware);

  //if (isDev) {
  //  const { createLogger } = require('redux-logger');
  //  const logger = createLogger({
  //    duration: true,
  //    timestamp: false,
  //    collapsed: true,
  //  });
  //  middlewares.push(logger);
  //}

  const store = createStore(
    createRootReducer(history),
    initialState,
    composeEnhancer(applyMiddleware(...middlewares)),
  );

  return store;
};
