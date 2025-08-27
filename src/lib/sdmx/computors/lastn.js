import * as R from 'ramda';
import { LASTNOBSERVATIONS, LASTNPERIODS } from '../../../utils/used-filter';
import { defaultLastNPeriods } from '../../settings';

const nullIfCond = (cond) => (value) => {
  if (cond) return null;
  return value;
};

export const lastNComputor = ({
  isTimePeriodDisable,
  hasLastNObservations,
  currentLastNMode,
  routerPeriod, // default defined by structure
  currentPeriod, // from actual router
  params, // default params defined by structure
  currentLastNObservations,
} = {}) => {
  const isTimePeriodDisableFunc = nullIfCond(isTimePeriodDisable);

  const hasCurrentTimeSelection = !(
    R.isNil(currentPeriod) &&
    R.isNil(currentLastNMode) &&
    R.isNil(currentLastNObservations)
  );

  if (hasCurrentTimeSelection) {
    const _lastNMode =
      !R.isNil(currentPeriod) && currentLastNMode === LASTNPERIODS
        ? null
        : currentLastNMode;

    const _lastNObservations = R.isNil(_lastNMode)
      ? null
      : currentLastNObservations;

    const _period = R.defaultTo(
      _lastNMode === LASTNPERIODS
        ? null
        : routerPeriod || [undefined, undefined],
      currentPeriod,
    );

    return {
      lastNMode: isTimePeriodDisableFunc(_lastNMode),
      lastNObservations: isTimePeriodDisableFunc(_lastNObservations),
      period: isTimePeriodDisableFunc(_period),
    };
  }

  const defaultStructLastNValue =
    R.prop('lastNPeriods', params) ||
    R.prop('lastNObservations', params) ||
    null;

  const defaultStructLastNMode = R.has('lastNPeriods', params)
    ? LASTNPERIODS
    : R.has('lastNObservations', params)
      ? LASTNOBSERVATIONS
      : null;

  const __lastNMode = nullIfCond(
    !R.isNil(routerPeriod) && defaultStructLastNMode !== LASTNOBSERVATIONS,
  )(R.defaultTo(LASTNPERIODS, defaultStructLastNMode));

  const _lastNMode = nullIfCond(
    __lastNMode === LASTNOBSERVATIONS && !hasLastNObservations,
  )(__lastNMode);

  const _lastNObservations = R.isNil(_lastNMode)
    ? null
    : R.isNil(currentLastNObservations)
      ? R.defaultTo(defaultLastNPeriods, defaultStructLastNValue)
      : currentLastNObservations;

  const _period = nullIfCond(_lastNMode === LASTNPERIODS)(
    R.defaultTo(routerPeriod || [undefined, undefined], currentPeriod),
  );

  return {
    lastNMode: isTimePeriodDisableFunc(_lastNMode),
    lastNObservations: isTimePeriodDisableFunc(_lastNObservations),
    period: isTimePeriodDisableFunc(_period),
  };
};
