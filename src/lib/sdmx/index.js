import * as R from 'ramda';
import dateFns from 'date-fns';
import {
  sdmxPeriodBoundaries,
  defaultFrequency,
  sdmxPeriod as defaultSettingsPeriod,
} from '../settings';
import {
  applyFormat,
  getDatesFromSdmxPeriod,
  replaceUndefinedDates,
  parseInclusiveDates,
  getAscendentDates,
  getEndOfYear,
  getAjustedDate,
} from './frequency';
import { getDateInTheRange } from '../../utils/date';
import {
  getRequestArgs,
  LAST_N_PERIODS_PARAM_KEY,
} from '@sis-cc/dotstatsuite-sdmxjs';
import {
  DISPLAY_BOTH,
  DISPLAY_CODE,
  DISPLAY_LABEL,
} from '../../utils/constants';

export const getFilename = ({ identifiers, dataquery, isFull }) => {
  const ids = R.props(['agencyId', 'code', 'version'], identifiers);
  const timestamp = dateFns.format(new Date(), 'YYYY-MM-DD HH-mm-ss');
  return R.pipe(
    R.append(R.isNil(dataquery) || isFull ? 'complete' : 'filtered'),
    R.append(timestamp),
    R.join(','),
  )(ids);
};

export const getDefaultRouterParams = ({
  params,
  dataquery,
  timePeriodBoundaries,
  inclusiveBoundaries,
  frequencyArtefact,
  hasDataAvailability,
}) => {
  const annotLastNPeriods = R.prop(LAST_N_PERIODS_PARAM_KEY)(params);
  const frequency = R.pipe(
    R.when(R.isNil, R.always('')),
    R.split('.'),
    R.view(R.lensIndex(R.prop('index')(frequencyArtefact))),
    R.ifElse(
      R.either(R.isEmpty, R.isNil),
      R.always(defaultFrequency),
      R.identity,
    ),
  )(dataquery);

  const periodBoundaries = hasDataAvailability
    ? R.pipe(
        replaceUndefinedDates(sdmxPeriodBoundaries),
        parseInclusiveDates(inclusiveBoundaries, frequency),
        getAscendentDates,
      )(timePeriodBoundaries)
    : sdmxPeriodBoundaries;
  const period = R.pipe(
    R.ifElse(
      R.anyPass([R.has('startPeriod'), R.has('endPeriod')]),
      R.converge(
        (start, end) => getDatesFromSdmxPeriod(frequency)([start, end]),
        [R.prop('startPeriod'), R.prop('endPeriod')],
      ),
      R.always(defaultSettingsPeriod),
    ),
    (dates) => [
      R.head(dates),
      R.pipe(R.last, getEndOfYear, getAjustedDate(frequency))(dates),
    ],
    R.map(R.pipe(getDateInTheRange(periodBoundaries), applyFormat(frequency))),
    R.when(([start, end]) => R.isNil(start) && R.isNil(end), R.always(null)),
  )(params);

  return {
    ...R.pick(['lastNObservations'], params),
    dataquery,
    period: !R.isNil(annotLastNPeriods) ? null : period,
    frequency,
  };
};

export const getSelectedIdsIndexed = R.pipe(
  R.indexBy(R.prop('id')),
  R.map(
    R.pipe(
      R.propOr([], 'values'),
      R.reduce((acc, value) => {
        if (R.prop('isSelected', value))
          return R.append(R.prop('id', value), acc);
        return acc;
      }, []),
    ),
  ),
);

export const setSelectedDimensionsValues = (dataquery, dimensions) => {
  const splitDataquery = R.split('.', dataquery);
  return R.addIndex(R.map)((dimension, index) => {
    if (R.isEmpty(dimension)) return {};
    const partialDataquery = R.nth(index)(splitDataquery);
    if (R.isNil(partialDataquery)) return {};
    const selectedIds = R.pipe(
      R.split('+'),
      (ids) => new Set(ids),
    )(partialDataquery);
    return R.over(
      R.lensProp('values'),
      R.map(
        R.ifElse(
          R.pipe(R.prop('id'), (id) => selectedIds.has(id)),
          R.assoc('isSelected', true),
          R.identity,
        ),
      ),
    )(dimension);
  })(dimensions);
};

export const getOnlyHasDataDimensions = R.map((dimension) => {
  if (R.either(R.isNil, R.isEmpty, R.prop('isAttribute'))(dimension))
    return dimension;
  if (R.propEq(false, 'hasData')(dimension)) return {};
  return R.over(
    R.lensProp('values'),
    R.reject(R.propEq(false, 'hasData')),
  )(dimension);
});

export const rawDataRequestArgsWrapper = (
  args,
  dataquery,
  params,
  externalReference,
  range,
) => ({
  ...R.when(
    R.always(R.not(R.isNil(externalReference))),
    R.mergeLeft(externalReference),
  )(args),
  dataquery,
  params,
  ...(R.path(['datasource', 'hasRangeHeader'], args) ? { range } : {}),
});

const displayToLabelsAcceptHeader = (display) => {
  if (display === DISPLAY_LABEL) return 'labels=name';
  if (display === DISPLAY_BOTH) return 'labels=both';
  if (display === DISPLAY_CODE) return 'labels=code';
  return;
};

export const dataFileRequestArgsWrapper =
  (isFull) => (requestArgs, display) => {
    const defaultRequestArgs = getRequestArgs({
      ...R.omit(
        R.when(R.always(isFull), R.concat(['dataquery', 'params']))(['range']),
        requestArgs,
      ),
      asFile: true,
      format: 'csv',
      type: 'data',
      labels: displayToLabelsAcceptHeader(display),
    });

    return {
      url: defaultRequestArgs.url,
      headers: defaultRequestArgs.headers,
      params: {
        ...defaultRequestArgs.params,
        format: display === DISPLAY_CODE ? 'csvfile' : 'csvfilewithlabels',
      },
      filename: R.pipe(R.assoc('isFull', isFull), getFilename)(requestArgs),
      datasourceId: R.path(['datasource', 'id'], requestArgs),
    };
  };
