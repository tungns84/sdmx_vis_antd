import { createSelector } from 'reselect';
import * as R from 'ramda';
import {
  getFrequencyArtefact as SDMXJS_getFrequencyArtefact,
  getRequestArgs,
  isFrequencyDimension,
  constrainDimensions,
  getSDMXUrl,
} from '@sis-cc/dotstatsuite-sdmxjs';
import Set from 'es6-set';
import {
  sdmxFormat,
  getFrequencies,
  parseDateFromSdmxPeriod,
  getFrequencyFromSdmxPeriod,
  getAjustedDate,
  getSdmxPeriod,
  getSubstructedDate,
  getAscendentDates,
} from '../lib/sdmx/frequency';
import { getDateInTheRange } from '../utils/date';
import {
  getDatasource as getSettingsDatasource,
  locales,
  sdmxPeriodBoundaries,
} from '../lib/settings';
import {
  getLastNObservations,
  getLocale,
  getPeriod as getRouterPeriod,
  getHasDataAvailability,
  getDataquery,
  getDataflow,
  getDisplay,
  getLastNMode,
} from './router';
import {
  dataFileRequestArgsWrapper,
  getOnlyHasDataDimensions,
  rawDataRequestArgsWrapper,
} from '../lib/sdmx';
import { applyAutomatedSelection } from '../lib/sdmx/selection';
import { cleanDeadBranches } from '../utils/clean-dead-branches';
import { getMultiHierarchicalFilters } from '../lib/sdmx/hierarchical-codelist';
import { LASTNOBSERVATIONS, LASTNPERIODS } from '../utils/used-filter';
import { getTimePeriodBoundaries } from '../lib/sdmx/accessors/constraints';
import { cleanifyLayoutIds } from '../utils';
import {
  getTimePeriodArtefact as _getTPArtefact,
  getTimePeriodContraints,
} from '../lib/sdmx/structure';
//------------------------------------------------------------------------------------------------#0
const getSdmx = R.prop('sdmx');
const getMicrodataDimensionId = createSelector(
  R.prop('microdata'),
  R.prop('dimensionId'),
);
//------------------------------------------------------------------------------------------------#1
export const getAnnotations = createSelector(
  getSdmx,
  R.pathOr([], ['data', 'structure', 'annotations']),
);
export const _getDimensions = createSelector(
  getSdmx,
  R.propOr([], 'dimensions'),
);
export const getAttributes = createSelector(
  getSdmx,
  R.propOr([], 'attributes'),
);
export const getDataRequestRange = createSelector(
  getSdmx,
  R.prop('dataRequestRange'),
);
export const getHiddenValuesAnnotation = createSelector(
  getSdmx,
  R.prop('hiddenValuesAnnotation'),
);
export const getData = createSelector(getSdmx, R.prop('data'));
export const getDataRange = createSelector(getSdmx, R.prop('range'));

export const getExternalResources = createSelector(
  getSdmx,
  R.prop('externalResources'),
);
export const getExternalReference = createSelector(
  getSdmx,
  R.prop('externalReference'),
);
export const getConstraints = createSelector(getSdmx, R.prop('constraints'));
export const getDataflowName = createSelector(getSdmx, ({ name, data }) =>
  R.isNil(data) ? name : R.path(['structure', 'name'], data),
);
export const getHierarchies = createSelector(getSdmx, R.prop('hierarchies'));
export const getHCodes = createSelector(getSdmx, R.prop('hCodes'));
export const getCombinationsDefinition = createSelector(
  getSdmx,
  R.propOr([], 'combinationsDefinition'),
);
export const getParsedAttributes = createSelector(
  getSdmx,
  R.propOr([], 'parsedAttributes'),
);
export const getIsAvailabilityDisabled = createSelector(
  getSdmx,
  R.propOr(false, 'isAvailabilityDisabled'),
);
export const _getDefaultLayoutIds = createSelector(
  getSdmx,
  R.propOr({}, 'defaultLayoutIds'),
);
export const getActualContentConstraints = createSelector(
  getSdmx,
  R.propOr([], 'actualContentConstraints'),
);
export const getActuallContentConstraintId = createSelector(
  getSdmx,
  R.propOr(null, 'constraintId'),
);
const getTimePeriod = createSelector(getSdmx, R.propOr(null, 'timePeriod'));
//------------------------------------------------------------------------------------------------#2
export const getActualContentConstraint = createSelector(
  getActualContentConstraints,
  getActuallContentConstraintId,
  (constraints, constraintId) =>
    R.pipe(R.find(R.propEq(constraintId, 'id')), R.defaultTo({}))(constraints),
);

export const getTimePeriodArtefact = createSelector(
  getActualContentConstraint,
  getTimePeriod,
  (constraint, timePeriod) => {
    const isTimePeriodDisable =
      R.isNil(timePeriod) || !R.prop('display', timePeriod);
    const timePeriodConstraint = getTimePeriodContraints(
      isTimePeriodDisable,
      timePeriod,
      R.propOr({}, 'cubeRegions', constraint),
    );
    const timePeriodBoundaries = R.propOr(
      [],
      'boundaries',
      timePeriodConstraint,
    );
    const timePeriodArtefact = _getTPArtefact({
      timePeriod,
      isTimePeriodDisable,
      timePeriodBoundaries,
    });
    return timePeriodArtefact;
  },
);

export const getDimensions = createSelector(
  _getDimensions,
  getActualContentConstraint,
  (dimensions = [], constraint = {}) =>
    constrainDimensions(dimensions, R.propOr({}, 'cubeRegions', constraint)),
);

export const getAvailableTimePeriod = createSelector(
  getConstraints,
  R.prop('availableTimePeriod'),
);
export const getFrequencyArtefact = createSelector(
  getDimensions,
  getAttributes,
  (dimensions = [], attributes = []) =>
    SDMXJS_getFrequencyArtefact({ dimensions, attributes }),
);

export const getDatasource = createSelector(
  getDataflow,
  getExternalReference,
  (dataflow, externalReference) =>
    R.defaultTo(
      {},
      R.isNil(externalReference)
        ? getSettingsDatasource(R.prop('datasourceId', dataflow))
        : externalReference.datasource,
    ),
);

export const getRawStructureRequestArgs = createSelector(
  getDataflow,
  getLocale,
  getExternalReference,
  (dataflow, locale, externalReference) =>
    R.isNil(externalReference)
      ? {
          datasource: getSettingsDatasource(R.prop('datasourceId', dataflow)),
          identifiers: {
            code: R.prop('dataflowId', dataflow),
            ...R.pick(['agencyId', 'version'], dataflow),
          },
          locale,
        }
      : R.assoc('locale', locale, externalReference),
);

export const getDefaultLayoutIds = createSelector(
  _getDefaultLayoutIds,
  cleanifyLayoutIds,
);
//------------------------------------------------------------------------------------------------#3
export const getStructureRequestArgs = createSelector(
  getRawStructureRequestArgs,
  (args) =>
    getRequestArgs({
      ...args,
      type: 'dataflow',
      withPartialReferences: true,
    }),
);

export const getHierarchisedDimensions = createSelector(
  getDimensions,
  getHierarchies,
  (dimensions, hierarchies) =>
    getMultiHierarchicalFilters(dimensions, hierarchies),
);

const getAutomatedSelectionsArg = (_, { automatedSelections }) =>
  automatedSelections;

export const getDimensionsWithDataQuerySelection = createSelector(
  getHierarchisedDimensions,
  getDataquery,
  getMicrodataDimensionId,
  getAutomatedSelectionsArg,
  (filters, dataquery, microdataDimId, automatedSelections) =>
    R.pipe(
      R.useWith(
        (filters, dataquery) =>
          R.addIndex(R.map)((_filter, index) => {
            if (R.isEmpty(_filter)) return _filter;
            const filter = R.has(_filter.id, automatedSelections)
              ? R.over(R.lensProp('values'), (values) =>
                  applyAutomatedSelection(
                    values,
                    R.prop(_filter.id, automatedSelections),
                  ),
                )(_filter)
              : _filter;
            if (
              R.pipe(R.nth(index), R.anyPass([R.isEmpty, R.isNil]))(dataquery)
            )
              return filter;
            const valueIdsSet = new Set(
              R.pipe(R.nth(index), R.split('+'))(dataquery),
            );
            return R.over(
              R.lensProp('values'),
              R.map(
                R.ifElse(
                  ({ id }) => valueIdsSet.has(id),
                  R.assoc('isSelected', true),
                  R.identity,
                ),
              ),
              filter,
            );
          }, filters),
        [R.identity, R.ifElse(R.isNil, R.always([]), R.split('.'))],
      ),
      R.reject(
        R.anyPass([
          R.pipe(R.prop('display'), R.not),
          R.propEq(microdataDimId, 'id'),
          isFrequencyDimension,
          R.pipe(R.prop('values'), R.length, R.gte(1)),
        ]),
      ),
    )(filters, dataquery),
);

//------------------------------------------------------------------------------------------------#4
const getAvailableConstraintsArg = (_, { availableConstraints }) =>
  availableConstraints;

export const getFilters = createSelector(
  getHasDataAvailability,
  getDimensionsWithDataQuerySelection,
  getAvailableConstraintsArg,
  getHiddenValuesAnnotation,
  (hasDataAvailability, filters, availableConstraints = {}, hiddenIds) =>
    R.pipe(
      (dimensions) =>
        constrainDimensions(dimensions, availableConstraints, 'isEnabled'),
      R.when(
        R.always(hasDataAvailability),
        R.pipe(R.map(R.over(R.lensProp('values'), cleanDeadBranches))),
      ),
      R.filter((filter) =>
        R.pipe(
          R.propOr([], 'values'),
          (values) =>
            R.length(values) > 1 &&
            (hiddenIds[filter.id]
              ? !R.isEmpty(
                  R.difference(R.pluck('id')(values), hiddenIds[filter.id]),
                )
              : true),
        )(filter),
      ),
    )(filters),
);

export const getAvailableFrequencies = createSelector(
  getFrequencyArtefact,
  getHasDataAvailability,
  (frequencyArtefact = {}, hasDataAvailability) => {
    return R.pipe(
      R.ifElse(
        R.always(hasDataAvailability),
        R.pipe(R.of(Array), getOnlyHasDataDimensions, R.head),
        R.identity,
      ),
      getFrequencies,
    )(frequencyArtefact);
  },
);

export const getFrequency = createSelector(
  getRouterPeriod,
  getFrequencyArtefact,
  getDataquery,
  getAvailableFrequencies,
  (
    routerPeriod,
    frequencyArtefact = {},
    dataquery = '',
    availableFrequencies = {},
  ) => {
    const splitDataquery = R.split('.', dataquery);
    const isFrequencyArtefactDimension = !frequencyArtefact.isAttribute;
    const frequency = R.view(
      R.lensIndex(frequencyArtefact.index),
      splitDataquery,
    );
    if (isFrequencyArtefactDimension && !R.isNil(frequency)) return frequency;

    const frequencyFromPeriod = getFrequencyFromSdmxPeriod(routerPeriod);
    if (!R.isNil(frequencyFromPeriod)) return frequencyFromPeriod;

    if (frequencyArtefact.isAttribute)
      return R.pipe(R.keys, R.head)(availableFrequencies);

    return;
  },
);

export const getDatesBoundaries = createSelector(
  getTimePeriodArtefact,
  getFrequency,
  getHasDataAvailability,
  (artefact, frequency, hasDataAvailability) => {
    if (R.isNil(artefact)) {
      return null;
    }
    const boundaries = hasDataAvailability
      ? R.propOr([], 'timePeriodBoundaries', artefact)
      : sdmxPeriodBoundaries;
    return R.map(getAjustedDate(frequency))(boundaries);
  },
);

//------------------------------------------------------------------------------------------------#5
export const getPeriod = createSelector(
  getRouterPeriod,
  getFrequency,
  getDatesBoundaries,
  (sdmxPeriod, frequency, boundaries) => {
    if (R.isNil(sdmxPeriod)) return [undefined, undefined];
    const period = parseDateFromSdmxPeriod(frequency, sdmxPeriod);
    return R.ifElse(
      R.pipe(R.length, R.equals(2)),
      R.map(getDateInTheRange(boundaries)),
      R.always(R.map(getDateInTheRange(boundaries))(sdmxPeriod)),
    )(period);
  },
);

export const getTimeFormats = createSelector(getLocale, (locale) => {
  return R.mergeRight(sdmxFormat, {
    M: R.pathOr('YYYY MMM', [locale, 'timeFormat'], locales),
  });
});

//------------------------------------------------------------------------------------------------#6
export const getDataRequestParams = createSelector(
  getRouterPeriod,
  getLastNObservations,
  getAvailableTimePeriod,
  getLastNMode,
  getFrequency,
  (_period, lastNValue, availableTimePeriod, lastNMode, frequency) => {
    const boundaries = getTimePeriodBoundaries(availableTimePeriod);
    const lastNObservations = R.equals(lastNMode, LASTNOBSERVATIONS)
      ? lastNValue
      : null;

    if (!R.isNil(_period))
      return {
        lastNObservations,
        startPeriod: R.head(_period),
        endPeriod: R.last(_period),
      };

    const period = [undefined, undefined];

    const formattedAvailablePeriod = R.ifElse(
      R.either(R.isNil, R.isEmpty),
      R.always([undefined, undefined]),
      R.map((period) => {
        if (R.isNil(period)) {
          return period;
        }
        return new Date(period.toString());
      }),
    )(boundaries);
    const diff =
      !R.isNil(R.last(formattedAvailablePeriod)) && !R.isNil(lastNValue)
        ? getSubstructedDate(
            R.last(formattedAvailablePeriod),
            lastNValue,
            frequency,
          )
        : null;

    const newStartPeriod =
      !R.isNil(diff) && R.isNil(R.head(period))
        ? R.ifElse(
            R.either(R.isNil, R.isEmpty),
            R.always([undefined, undefined]),
            R.identity,
          )(getSdmxPeriod(frequency))(
            getAscendentDates(diff, R.head(formattedAvailablePeriod)),
          )
        : R.head(period);

    return {
      startPeriod: R.equals(lastNMode, LASTNPERIODS)
        ? newStartPeriod
        : R.head(period),
      endPeriod: R.last(period),
      lastNObservations,
    };
  },
);

export const getRefinedDataRange = createSelector(
  getData,
  getDataRange,
  (data, range) => {
    if (!R.isNil(range) && !R.isEmpty(range)) {
      return range;
    }
    const observations = R.pathOr({}, ['dataSets', 0, 'observations'], data);
    const count = R.length(R.values(observations));
    return { count, total: count };
  },
);

export const getRawDataRequestArgs = createSelector(
  getRawStructureRequestArgs,
  getDataquery,
  getDataRequestParams,
  getExternalReference,
  getDataRequestRange,
  rawDataRequestArgsWrapper,
);

export const getDataRequestArgs = createSelector(
  getRawDataRequestArgs,
  ({ datasource, ...rest }) => {
    return R.pipe(
      getRequestArgs,
      R.assoc('datasourceId', R.prop('id', datasource)),
    )({ ...rest, datasource, type: 'data' });
  },
);

export const getIsDataUrlTooLong = createSelector(
  getSdmx,
  R.prop('isDataUrlTooLong'),
);
export const getIsApiQueryCopied = createSelector(
  getSdmx,
  R.prop('isApiQueryCopied'),
);
export const getDataFileRequestArgs = (isFull) =>
  createSelector(
    getRawDataRequestArgs,
    getDisplay,
    dataFileRequestArgsWrapper(isFull),
  );

export const getDataSourceHeaders = createSelector(
  getDataRequestArgs,
  R.prop('headers'),
);

export const getStructureUrl = createSelector(
  getRawStructureRequestArgs,
  getExternalReference,
  (args, externalReference) =>
    getSDMXUrl({
      ...R.when(
        R.always(R.not(R.isNil(externalReference))),
        R.mergeLeft(externalReference),
      )(args),
      type: 'dataflow',
    }),
);

export const getDataUrl = ({ agnostic }) =>
  createSelector(getRawDataRequestArgs, (args) =>
    getSDMXUrl({ ...args, agnostic, type: 'data' }),
  );

export const getAvailableConstraintsArgs = (dataquery = null) =>
  createSelector(getRawDataRequestArgs, (args) => {
    return R.pipe(
      R.over(R.lensProp('params'), (params) => {
        if (R.isNil(params)) return params;
        return R.pick(['endPeriod', 'startPeriod'], params);
      }),
      R.over(R.lensProp('dataquery'), (dq) => {
        if (R.isNil(dataquery)) return dq;
        return dataquery;
      }),
      getRequestArgs,
      R.over(R.lensProp('params'), R.assoc('mode', 'available')),
      R.assoc(
        'supportsPostLongRequests',
        R.propOr(false, 'supportsPostLongRequests', args.datasource),
      ),
      R.assoc('datasourceId', R.path(['datasource', 'id'], args)),
    )({
      ...args,
      withReferences: false,
      type: 'availableconstraint',
    });
  });

export const getIsCsvFileLinkHandled = createSelector(
  getDatasource,
  R.propOr(true, 'supportsCsvFile'),
);
