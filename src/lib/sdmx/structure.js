import * as R from 'ramda';
import dateFns from 'date-fns';
import {
  cellsLimit,
  isDefaultTimeDimensionInverted,
  sdmxPeriodBoundaries,
} from '../settings';

export const getDataRequestRange = (size) => {
  const _size = R.isNil(size) || size <= 0 ? cellsLimit : size;
  if (!_size) return null;
  return _size;
};

export const getIsIncreased = (size) => {
  return !R.isNil(size) && size > cellsLimit;
};

export const getObservationCount = (constraintsArtefact) => {
  return R.pipe(
    R.propOr([], 'annotations'),
    R.find(R.propEq('obs_count', 'id')),
    R.prop('title'),
  )(constraintsArtefact);
};

export const getIsTimePeriodDisable = (timePeriod) => {
  return R.or(R.not(R.prop('display', timePeriod)), R.isNil(timePeriod));
};

export const getTimePeriodContraints = (
  isTimePeriodDisable,
  timePeriod,
  contentConstraints,
) => {
  if (isTimePeriodDisable) return null;
  return R.prop(R.prop('id', timePeriod), contentConstraints);
};

export const getTimePeriodBoundaries = (timePeriodContraints) => {
  return R.pipe(
    R.propOr([], 'boundaries'),
    (bound) =>
      R.isNil(bound[0]) || R.isNil(bound[1]) ? sdmxPeriodBoundaries : bound,
    R.map(
      R.when(
        R.identity,
        R.pipe((date) => dateFns.parse(date)),
      ),
    ),
  )(timePeriodContraints);
};

export const getTimePeriodArtefact = ({
  timePeriod,
  isTimePeriodDisable,
  timePeriodBoundaries,
}) => {
  if (isTimePeriodDisable) return null;
  return { ...timePeriod, timePeriodBoundaries };
};

export const getTime = ({ timePeriod, isTimePeriodInversed }) => {
  const timePeriodId = R.propOr('TIME', 'id', timePeriod);
  return {
    [timePeriodId]: isTimePeriodInversed || isDefaultTimeDimensionInverted,
  };
};
