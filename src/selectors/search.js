import { createSelector } from 'reselect';
import * as R from 'ramda';
import { getTerm, getConstraints } from './router';

//------------------------------------------------------------------------------------------------#0
export const getSearch = R.prop('search');

//------------------------------------------------------------------------------------------------#1
export const getRows = createSelector(getSearch, R.prop('rows'));
export const getExternalResources = createSelector(
  getSearch,
  R.prop('externalResources'),
);

//------------------------------------------------------------------------------------------------#2
export const getHasNoSearchParams = createSelector(
  getTerm,
  getConstraints,
  (term, constraints) =>
    R.and(
      R.anyPass([R.isEmpty, R.isNil])(term),
      R.anyPass([R.isEmpty, R.isNil])(constraints),
    ),
);
