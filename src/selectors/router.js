import { createSelector } from 'reselect';
import * as R from 'ramda';
import { i18n, locales, getDatasource, defaultViewer } from '../lib/settings';
import { fromSearchToState } from '../utils/router';
import { OVERVIEW, TABLE } from '../utils/constants';
import { DEFAULT_SORT_INDEX_SELECTED } from '../lib/search/constants';
import { cleanifyLayoutIds } from '../utils';

//------------------------------------------------------------------------------------------------#0
const getRouter = R.prop('router');

//------------------------------------------------------------------------------------------------#1
export const getLocation = createSelector(getRouter, R.propOr({}, 'location'));

//------------------------------------------------------------------------------------------------#2
export const getLocationState = createSelector(
  getLocation,
  R.pipe(
    R.prop('state'),
    R.defaultTo(fromSearchToState(window.location.search)),
  ),
);

export const getPathname = createSelector(
  getLocation,
  R.propOr('/', 'pathname'),
);

//------------------------------------------------------------------------------------------------#3
export const getSortIndexSelected = createSelector(
  getLocationState,
  R.propOr(DEFAULT_SORT_INDEX_SELECTED, 'sortIndexSelected'),
);
export const getTerm = createSelector(getLocationState, R.propOr('', 'term'));
export const getSearchResultNb = createSelector(
  getLocationState,
  R.propOr(0, 'searchResultNb'),
);
export const getIsBypass = createSelector(getLocationState, R.prop('bypass'));
export const getStart = createSelector(getLocationState, R.prop('start'));
export const getLocale = createSelector(
  getLocationState,
  R.propOr(i18n.localeId, 'locale'),
);
export const getFacet = createSelector(getLocationState, R.prop('facet'));
export const getConstraints = createSelector(
  getLocationState,
  R.propOr({}, 'constraints'),
);

export const getDataflow = createSelector(
  getLocationState,
  R.propOr({}, 'dataflow'),
);
export const getDataquery = createSelector(
  getLocationState,
  R.propOr('', 'dataquery'),
);
export const getHasAccessibility = createSelector(
  getLocationState,
  R.prop('hasAccessibility'),
);
export const getHasDataAvailability = createSelector(
  getLocationState,
  R.propOr(true, 'hasDataAvailability'),
);
export const getIsDataAvaibilityInState = createSelector(
  getLocationState,
  R.pipe(R.prop('hasDataAvailability'), R.isNil, R.not),
);
export const getViewer = createSelector(
  getLocationState,
  R.propOr(defaultViewer, 'viewer'),
);
export const getMap = createSelector(getLocationState, R.prop('map'));
export const getPeriod = createSelector(getLocationState, R.prop('period'));
export const _getTableLayout = createSelector(
  getLocationState,
  R.prop('layout'),
);
export const getDisplay = createSelector(
  getLocationState,
  R.propOr('label', 'display'),
);
export const getTimeDimensionOrders = createSelector(
  getLocationState,
  R.propOr({}, 'time'),
);
export const getMicrodataConstraints = createSelector(
  getLocationState,
  R.propOr({}, 'microdataConstraints'),
);

//------------------------------------------------------------------------------------------------#4
export const getIsOverview = createSelector(getViewer, R.equals(OVERVIEW));
export const getIsTable = createSelector(getViewer, R.equals(TABLE));
export const getHasLastNObservations = createSelector(
  getDataflow,
  R.pipe(
    R.prop('datasourceId'),
    getDatasource,
    R.propOr(false, 'hasLastNObservations'),
  ),
);

export const getIsShareable = createSelector(
  getDataflow,
  R.pipe(R.prop('datasourceId'), getDatasource, R.propOr(true, 'isShareable')),
);

export const getTableLayout = createSelector(
  _getTableLayout,
  cleanifyLayoutIds,
);

//------------------------------------------------------------------------------------------------#5
export const getLastNObservations = createSelector(
  getLocationState,
  R.prop('lastNObservations'),
);
export const getLastNPeriods = createSelector(
  getLocationState,
  R.prop('lastNPeriods'),
);
export const getLastNMode = createSelector(
  getLocationState,
  R.prop('lastNMode'),
);
//--------------------------------------------------------------------------------------------------
export const getIsRtl = createSelector(getLocale, (localeId) =>
  R.pipe(R.prop(localeId), R.prop('isRtl'))(locales),
);
