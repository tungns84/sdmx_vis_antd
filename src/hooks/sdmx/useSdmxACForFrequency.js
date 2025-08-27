import { useDispatch, useSelector } from 'react-redux';
import * as R from 'ramda';
import {
  isFrequencyDimension,
  parseActualContentConstraints,
  updateDataquery,
} from '@sis-cc/dotstatsuite-sdmxjs';
import useSdmxQuery from './useSdmxQuery';
import useDeepCompareEffect from 'use-deep-compare-effect';
import {
  getAvailableFrequencies,
  getFrequency,
  getFrequencyArtefact,
  getDimensions,
  getAvailableConstraintsArgs,
} from '../../selectors/sdmx';
import { getDataquery } from '../../selectors/router';
import { HANDLE_AVAILABLE_FREQUENCY } from '../../ducks/sdmx';
import { defaultFrequency } from '../../lib/settings';

const handleConstraints =
  (dispatch) =>
  ({ data = {} } = {}) => {
    dispatch({
      type: HANDLE_AVAILABLE_FREQUENCY,
      replaceStraigthHistory: {
        pathname: '/vis',
        payload: { dataquery: R.propOr('', 'dataquery', data) },
      },
    });
  };

export default () => {
  const dispatch = useDispatch();
  const dispatchHandleConstraints = handleConstraints(dispatch);

  const frequency = useSelector(getFrequency);
  const availableFrequencies = useSelector(getAvailableFrequencies);
  const dimensions = useSelector(getDimensions);
  const dataquery = useSelector(getDataquery);
  const frequencyArtefact = useSelector(getFrequencyArtefact);
  const requestArgs = useSelector(getAvailableConstraintsArgs());

  const hasFrequencyDimension = R.pipe(
    R.filter(isFrequencyDimension),
    R.isEmpty,
    R.not,
  )(dimensions);
  const hasNoFrequency = R.isNil(frequency) || R.isEmpty(frequency);
  const hasMultipleFrequencies = R.pipe(
    R.keys,
    R.length,
    R.lt(1),
  )(availableFrequencies);
  const isEnabled =
    hasFrequencyDimension && hasNoFrequency && hasMultipleFrequencies;

  const frequencyId = frequencyArtefact?.id;

  const ctx = {
    method: 'getAvailableConstraints',
    requestArgs: {
      ...requestArgs,
      url: `${requestArgs.url}/ALL/${frequencyId}`,
    },
  };

  const transformerHook = (constraints) => {
    const head = (set) => {
      const iter = set.values();
      return iter.next().value;
    };

    const parsedConstraints = parseActualContentConstraints()(constraints);
    const frequencyConstraints = R.prop(frequencyId, parsedConstraints);
    const frequencyConstraint = frequencyConstraints.has(defaultFrequency)
      ? defaultFrequency
      : head(frequencyConstraints);

    return {
      dataquery: updateDataquery(dimensions, dataquery, {
        [frequencyId]: [frequencyConstraint],
      }),
    };
  };

  const successHandler = ({ data, queryKey }) => {
    dispatchHandleConstraints({ data, queryKey });
  };

  const errorHandler = ({ queryKey }) => {
    const nextDataquery = updateDataquery(dimensions, dataquery, {
      [frequencyId]: [defaultFrequency],
    });
    dispatchHandleConstraints({ data: { dataquery: nextDataquery }, queryKey });
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
