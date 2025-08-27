import { useSelector } from 'react-redux';
import * as R from 'ramda';
import { parseActualContentConstraints } from '@sis-cc/dotstatsuite-sdmxjs';
import { getPeriod } from '../../selectors/router';
import {
  getAvailableConstraintsArgs,
  getDimensions,
  getFrequency,
  getFrequencyArtefact,
  getIsAvailabilityDisabled,
  getTimePeriodArtefact,
  getActualContentConstraint,
} from '../../selectors/sdmx';
import useSdmxQuery from './useSdmxQuery';
import { addPiTDateToArgs } from '../utils';

const IN_CACHE_PROPS = ['availableConstraints'];

export default (dataquery) => {
  const dimensions = useSelector(getDimensions);
  const _requestArgs = useSelector(getAvailableConstraintsArgs(dataquery));
  const routerPeriod = useSelector(getPeriod);
  const timePeriodArtefact = useSelector(getTimePeriodArtefact);
  const frequency = useSelector(getFrequency);
  const frequencyArtefact = useSelector(getFrequencyArtefact);
  const isAvailabilityDisabled = useSelector(getIsAvailabilityDisabled);
  const actualCC = useSelector(getActualContentConstraint);

  // Unduplicate with useSdmxData
  const requestArgs = addPiTDateToArgs(actualCC)(_requestArgs);
  const params = requestArgs?.params;
  const hasPeriod = !!params?.startPeriod || !!params?.endPeriod;
  const hasRouterPeriod = R.is(Array, routerPeriod);
  const hasDimensions = !R.all(R.isEmpty)(dimensions);
  const hasNoTime = R.isNil(timePeriodArtefact);
  const hasFrequency = !R.isNil(frequency);
  const hasNoFrequencyArtefact = R.isNil(frequencyArtefact);
  const isEnabled =
    hasDimensions &&
    !isAvailabilityDisabled &&
    (hasRouterPeriod || hasPeriod || hasNoTime) &&
    (hasFrequency || hasNoFrequencyArtefact);
  const ctx = { method: 'getAvailableConstraints', requestArgs };

  const transformerHook = (constraints) => {
    return {
      availableConstraints: parseActualContentConstraints()(constraints),
    };
  };

  const successHandler = (/*{ data, queryKey }*/) => {};
  const errorHandler = (/*{ queryKey }*/) => {};

  const query = useSdmxQuery(ctx, {
    isEnabled,
    transformerHook,
    successHandler,
    errorHandler,
  });

  return {
    // it's more user-friendly to expose direct RQ props (isLoading, isError, etc...)
    // without internals
    ...R.omit(['queryKey', 'isEnabled', 'data'], query),
    // only expose in cache props to avoid breaking single source of thruth principle
    // other props are stored in redux store for good or bad (refactoring needed) reasons
    ...R.pick(IN_CACHE_PROPS, R.propOr({}, 'data', query)),
  };
};
