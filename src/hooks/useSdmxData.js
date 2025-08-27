import { useDispatch, useSelector } from 'react-redux';
import * as R from 'ramda';
import {
  getDataRequestArgs,
  getDimensions,
  getFrequency,
  getFrequencyArtefact,
  getCombinationsDefinition,
  getActualContentConstraint,
} from '../selectors/sdmx';
import useSdmxStructure from './useSdmxStructure';
import { FLUSH_DATA, HANDLE_DATA } from '../ducks/sdmx';
import useSdmxQuery from './sdmx/useSdmxQuery';
import {
  getDataflow,
  getDataquery,
  getLocale,
  getTableLayout,
} from '../selectors/router';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { dataComputor } from '../lib/sdmx/computors/data';
import useSdmxDataTime from './sdmx/useSdmxDataTime';
import { addPiTDateToArgs } from './utils';

const IN_STATE_PROPS = ['data', 'range', 'parsedAttributes'];

const IN_CACHE_PROPS = [];

const IN_ROUTE_PROPS = [];

const handleData =
  (dispatch) =>
  ({ data = {}, queryKey = [] } = {}) => {
    dispatch({
      type: HANDLE_DATA,
      data: R.pick(IN_STATE_PROPS, data),
      queryKey,
      replaceStraigthHistory: {
        pathname: '/vis',
        payload: R.pick(IN_ROUTE_PROPS, data),
      },
    });
  };

export default () => {
  const dispatch = useDispatch();
  const dispatchHandleData = handleData(dispatch);

  const layoutIds = useSelector(getTableLayout);
  const dimensions = useSelector(getDimensions);
  const _requestArgs = useSelector(getDataRequestArgs);
  const locale = useSelector(getLocale);
  const frequency = useSelector(getFrequency);
  const dataflow = useSelector(getDataflow);
  const dataquery = useSelector(getDataquery);
  const combinations = useSelector(getCombinationsDefinition);
  const frequencyArtefact = useSelector(getFrequencyArtefact);
  const actualCC = useSelector(getActualContentConstraint);
  const { defaultLayoutIds } = useSdmxStructure();
  const { hasTime } = useSdmxDataTime();

  const hasDimensions = !R.all(R.isEmpty)(dimensions);
  const hasFrequency = !R.isNil(frequency);
  const hasNoFrequencyArtefact = R.isNil(frequencyArtefact);
  const isEnabled =
    hasDimensions && hasTime && (hasFrequency || hasNoFrequencyArtefact);

  const requestArgs = addPiTDateToArgs(actualCC)(_requestArgs);
  const ctx = { method: 'getData', requestArgs };

  const beforeHook = () => dispatch({ type: FLUSH_DATA });

  const transformerHook = (data) => {
    return dataComputor({
      locale,
      frequency,
      dataflow,
      dataquery,
      defaultLayoutIds: layoutIds || defaultLayoutIds,
      combinations,
    })(data);
  };

  const successHandler = ({ data, queryKey }) => {
    dispatchHandleData({ data, queryKey });
  };

  const query = useSdmxQuery(ctx, {
    isEnabled,
    beforeHook,
    transformerHook,
    successHandler,
    isNotCached: true, // do not put data in cache
  });

  useDeepCompareEffect(() => {
    if (query.isSuccess && query.data && query.isEnabled) {
      dispatchHandleData({ data: query.data, queryKey: query.queryKey });
    }
  }, [query]);

  return {
    // it's more user-friendly to expose direct RQ props (isLoading, isError, etc...)
    // without internals
    ...R.omit(['queryKey', 'isEnabled', 'data'], query),
    // only expose in cache props to avoid breaking single source of thruth principle
    // other props are stored in redux store for good or bad (refactoring needed) reasons
    ...R.pick(IN_CACHE_PROPS, R.propOr({}, 'data', query)),
  };
};
