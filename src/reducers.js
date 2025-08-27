import { combineReducers } from 'redux';
import {
  ROUTER_REDUCER_MAP_KEY,
  createRouterReducer,
} from '@lagunovsky/redux-react-router';
import app from './ducks/app';
import user from './ducks/user';
import search from './ducks/search';
import vis from './ducks/vis';
import sdmx from './ducks/sdmx';
import microdata from './ducks/microdata';
import metadata from './ducks/metadata';

export default (history) =>
  combineReducers({
    app,
    search,
    sdmx,
    vis,
    microdata,
    user,
    [ROUTER_REDUCER_MAP_KEY]: createRouterReducer(history),
    metadata,
  });
