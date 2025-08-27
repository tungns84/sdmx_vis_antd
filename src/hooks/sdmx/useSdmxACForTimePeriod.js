import { useDispatch, useSelector } from 'react-redux';
import * as R from 'ramda';
import useSdmxQuery from './useSdmxQuery';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { HANDLE_AVAILABLE_TIME_PERIOD } from '../../ducks/sdmx';
import {
  getAvailableConstraintsArgs,
  getDimensions,
  getFrequency,
  getFrequencyArtefact,
  getTimePeriodArtefact,
} from '../../selectors/sdmx';
import { getLastNMode, getPeriod } from '../../selectors/router';
import { LASTNPERIODS } from '../../utils/used-filter';
import { parseActualContentConstraints } from '@sis-cc/dotstatsuite-sdmxjs';

const IN_STATE_PROPS = ['availableTimePeriod'];

const handleConstraints =
  (dispatch) =>
  ({ data = {}, queryKey = [] } = {}) => {
    dispatch({
      type: HANDLE_AVAILABLE_TIME_PERIOD,
      constraints: R.pick(IN_STATE_PROPS, data),
      queryKey,
    });
  };

export default () => {
  const dispatch = useDispatch();
  const dispatchHandleConstraints = handleConstraints(dispatch);

  const requestArgs = useSelector(getAvailableConstraintsArgs());
  const dimensions = useSelector(getDimensions);
  const lastNMode = useSelector(getLastNMode);
  const routerPeriod = useSelector(getPeriod);
  const frequency = useSelector(getFrequency);
  const frequencyArtefact = useSelector(getFrequencyArtefact);
  const timePeriodArtefact = useSelector(getTimePeriodArtefact);

  const hasDimensions = !R.all(R.isEmpty)(dimensions);
  const hasNoTime = R.isNil(timePeriodArtefact);
  const isLastNP = R.equals(lastNMode, LASTNPERIODS);
  const hasRouterPeriod = R.is(Array, routerPeriod);
  const hasFrequency = !R.isNil(frequency);
  const hasNoFrequencyArtefact = R.isNil(frequencyArtefact);
  const isEnabled =
    hasDimensions &&
    isLastNP &&
    (hasFrequency || hasNoFrequencyArtefact) &&
    !hasRouterPeriod &&
    !hasNoTime;

  const ctx = {
    method: 'getAvailableConstraints',
    requestArgs: {
      ...requestArgs,
      url: `${requestArgs.url}/ALL/TIME_PERIOD`,
      params: {},
    },
  };

  const transformerHook = (constraints) => {
    return {
      availableTimePeriod: parseActualContentConstraints()(constraints),
    };
  };

  const successHandler = ({ data, queryKey }) => {
    dispatchHandleConstraints({ data, queryKey });
  };

  const errorHandler = ({ queryKey }) => {
    dispatchHandleConstraints({
      data: {
        availableTimePeriod: {
          [timePeriodArtefact.id]: {
            boundaries: R.prop('timePeriodBoundaries', timePeriodArtefact),
          },
        },
      },
      queryKey,
    });
  };

  const query = useSdmxQuery(ctx, {
    isEnabled,
    transformerHook,
    successHandler,
    errorHandler,
  });

  useDeepCompareEffect(() => {
    if (query.isSuccess && query.data && query.isEnabled) {
      dispatchHandleConstraints({ data: query.data, queryKey: query.queryKey });
    }
  }, [query]);

  return {
    // it's more user-friendly to expose direct RQ props (isLoading, isError, etc...)
    // without internals
    ...R.omit(['queryKey', 'isEnabled', 'data'], query),
  };
};
