import * as R from 'ramda';
import {
  HANDLE_EXTERNAL_REFERENCE,
  HANDLE_AVAILABLE_TIME_PERIOD,
  HANDLE_DATA,
  HANDLE_STRUCTURE,
} from '../ducks/sdmx';
import { getQueryKey } from '../selectors/app.js';
import { HANDLE_MICRODATA } from '../ducks/microdata';

const queryKeyToString = R.ifElse(R.isNil, R.always(''), R.join(' '));
const isQueryKeyEqual = (a, b) => {
  return queryKeyToString(a) === queryKeyToString(b);
};

const types = [
  HANDLE_STRUCTURE,
  HANDLE_DATA,
  HANDLE_MICRODATA,
  HANDLE_AVAILABLE_TIME_PERIOD,
  HANDLE_EXTERNAL_REFERENCE,
];

export const sdmxMiddleware = (store) => (next) => (action) => {
  if (!R.includes(action.type, types)) return next(action);

  const queryKey = getQueryKey(action.type)(store.getState());
  if (isQueryKeyEqual(queryKey, action.queryKey)) return;

  return next(action);
};
