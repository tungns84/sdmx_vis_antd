import * as R from 'ramda';
import qs from 'qs';
import md5 from 'md5';
import { renameKeys } from '.';
import {
  keysBackwardCompatibilityMapSearchToState,
  keysMapStateToSearch,
  keysMapDataflow,
  keysMapLayout,
  keysMapDisplay,
  keysMapViewer,
  keysMapMap,
} from './constants';

const keysMapSearchToState = R.invertObj(keysMapStateToSearch);
const keysMapDataflowInverted = R.invertObj(keysMapDataflow);
const keysMapLayoutInverted = R.invertObj(keysMapLayout);
const keysMapDisplayInverted = R.invertObj(keysMapDisplay);
const keysMapViewerInverted = R.invertObj(keysMapViewer);
const keysMapMapInverted = R.invertObj(keysMapMap);

const escapeComma = R.replace(',', '%2C');

const fromStateDataflow = R.pipe(
  R.defaultTo({}),
  R.pick(['datasourceId', 'dataflowId', 'agencyId', 'version']),
  renameKeys(keysMapDataflow),
);
const fromStateConstraints = R.pipe(
  R.values,
  R.mapObjIndexed(R.pipe(R.map(escapeComma), R.values)),
);
const fromStateLayout = R.pipe(
  R.defaultTo({}),
  R.reject(R.isEmpty),
  R.ifElse(R.isEmpty, R.always(null), renameKeys(keysMapLayout)),
);

export const fromStateToSearch = (state) => {
  const qsOptions = {
    encodeValuesOnly: true,
    skipNulls: true,
    arrayFormat: 'comma',
  };
  const preparedState = R.pipe(
    R.evolve({
      constraints: fromStateConstraints,
      dataflow: fromStateDataflow,
      layout: fromStateLayout,
      display: R.flip(R.prop)(keysMapDisplay),
      viewer: R.flip(R.prop)(keysMapViewer),
      map: renameKeys(keysMapMap),
    }),
    R.reject(R.isEmpty),
    renameKeys(keysMapStateToSearch),
  )(state);
  return qs.stringify(preparedState, qsOptions);
};

const toStateBoolean = R.equals('true');
const toStateSearchConstraints = R.reduce((memo, [_facetId, _constraintId]) => {
  const facetId = decodeURIComponent(_facetId);
  const constraintId = decodeURIComponent(_constraintId);
  return R.assoc(
    md5(`${facetId}${constraintId}`),
    { facetId, constraintId },
    memo,
  );
}, {});
const toStateLayout = R.pipe(
  R.map(R.ifElse(R.is(Array), R.identity, (one) => [one])),
  renameKeys(keysMapLayoutInverted),
);
const toStateTime = R.map(toStateBoolean);
const toStatePeriod = R.map(
  R.ifElse(R.isEmpty, R.always(undefined), R.identity),
);
const toStateTerm = R.ifElse(R.is(Array), R.join(','), R.identity);

export const fromSearchToState = (search) => {
  const qsOptions = { ignoreQueryPrefix: true, comma: true };
  const state = qs.parse(search, qsOptions);

  return R.pipe(
    renameKeys(keysMapSearchToState),
    renameKeys(keysBackwardCompatibilityMapSearchToState),
    R.evolve({
      dataflow: renameKeys(keysMapDataflowInverted),
      display: R.flip(R.prop)(keysMapDisplayInverted),
      viewer: R.flip(R.prop)(keysMapViewerInverted),
      map: renameKeys(keysMapMapInverted),
      constraints: toStateSearchConstraints,
      hasAccessibility: toStateBoolean,
      hasDataAvailability: toStateBoolean,
      layout: toStateLayout,
      time: toStateTime,
      period: toStatePeriod,
      term: toStateTerm,
    }),
  )(state);
};

export const getVisUrl = (state, dataflow = {}) =>
  `/vis?${fromStateToSearch({ ...state, dataflow })}`;
