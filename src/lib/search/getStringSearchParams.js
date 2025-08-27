import * as R from 'ramda';
import { DEFAULT_SORT_INDEX_SELECTED, sortItems } from './constants';

export const getStringSearchParams = (index) =>
  R.pipe(R.pluck('id'), R.move(index, 0), R.join(', '))(sortItems);
export const sortedStringParams = (index) =>
  getStringSearchParams(index || DEFAULT_SORT_INDEX_SELECTED);
