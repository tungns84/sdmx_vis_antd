import * as R from 'ramda';
import md5 from 'md5';
import { CHANGE_LOCALE } from './app';
import { getConstraints, getFacet } from '../selectors/router';
import { defaultSearchRows } from '../lib/settings';
import { sortedStringParams } from '../lib/search/getStringSearchParams';

export const FIELD_IDS = [
  'id',
  'type',
  'version',
  'externalUrl',
  'agencyId',
  'dataflowId',
  'indexationDate',
  'lastUpdated',
  'name',
  'description',
  'dimensions',
  'datasourceId',
  'score',
];

export const model = () => ({
  dataflows: [],
  facets: [],
  rows: defaultSearchRows, // number of dataflows per page (search)
  sortParams: sortedStringParams(), // default sort params
});

export const HANDLE_SEARCH = '@@search/HANDLE_SEARCH';

export const RESET_SEARCH = '@@search/RESET_SEARCH';
export const resetSearch = () => ({
  type: RESET_SEARCH,
  pushHistory: { pathname: '/' },
});

export const CHANGE_TERM = '@@search/CHANGE_TERM';
export const changeTerm = ({ term } = {}) => ({
  type: CHANGE_TERM,
  pushHistory: {
    pathname: '/',
    payload: {
      term,
      start: 0,
      constraints: null,
      facet: null,
      highlightedConstraints: null,
    },
  },
});

export const CHANGE_FACET = '@@search/CHANGE_FACET';
export const changeFacet = (facetId) => (dispatch, getState) => {
  const prevFacetId = getFacet(getState());
  const facet = R.ifElse(
    R.equals(prevFacetId),
    R.always(null),
    R.identity,
  )(facetId);
  dispatch({
    type: CHANGE_FACET,
    pushHistory: { pathname: '/', payload: { facet } },
  });
};

export const CHANGE_START = '@@search/CHANGE_START';
export const changeStart = (start) => ({
  type: CHANGE_START,
  pushHistory: { pathname: '/', payload: { start } },
});

export const CHANGE_CONSTRAINTS = '@@search/CHANGE_CONSTRAINTS';
export const changeConstraints =
  (facetId, constraintIds, { bypass } = {}) =>
  (dispatch, getState) => {
    // constraintIds can be an array because of Chips component or a string because of CollapseButtons
    const constraintId = R.is(Array)(constraintIds)
      ? R.head(constraintIds)
      : constraintIds;
    const prevConstraints = getConstraints(getState());
    let constraints;
    if (R.isNil(facetId)) {
      // clear all constraints
      constraints = {};
    } else if (R.isEmpty(constraintIds)) {
      // clear all values of a facet
      constraints = R.reject(R.propEq(facetId, 'facetId'), prevConstraints);
    } else {
      // add or remove a value in a facet
      const hash = md5(`${facetId}${constraintId}`);
      constraints = R.ifElse(
        R.has(hash),
        R.dissoc(hash),
        R.assoc(hash, { facetId, constraintId }),
      )(prevConstraints);
    }

    dispatch({
      type: CHANGE_CONSTRAINTS,
      pushHistory: {
        pathname: '/',
        payload: {
          constraints,
          start: 0,
          facet: facetId,
          bypass,
          searchResultNb: null,
        },
      },
    });
  };

export const CHANGE_SEARCH_ORDER = '@@search/CHANGE_SEARCH_ORDER';
export const changeSearchOrder = (index) => (dispatch) => {
  dispatch({
    type: CHANGE_SEARCH_ORDER,
    pushHistory: { pathname: '/', payload: { sortIndexSelected: index } },
  });
};

//-------------------------------------------------------------------------------------------reducer
export default (state = model(), action = {}) => {
  switch (action.type) {
    case RESET_SEARCH:
      return { rows: defaultSearchRows };
    case CHANGE_LOCALE:
      return model();
    default:
      return state;
  }
};
