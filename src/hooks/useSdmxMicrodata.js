import { useDispatch, useSelector } from 'react-redux';
import * as R from 'ramda';
import { getFrequency, getHiddenValuesAnnotation } from '../selectors/sdmx';
import {
  getHasMicrodata,
  getMicrodataRequestArgs,
} from '../selectors/microdata';
import { FLUSH_MICRODATA, HANDLE_MICRODATA } from '../ducks/microdata';
import { MICRODATA } from '../utils/constants';
import useSdmxQuery from './sdmx/useSdmxQuery';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { dataComputor } from '../lib/sdmx/computors/microdata';
import { getDataflow, getLocale, getViewer } from '../selectors/router';

const IN_STATE_PROPS = ['data', 'range'];
const IN_CACHE_PROPS = [];

const handleMicrodata =
  (dispatch) =>
  ({ data = {}, queryKey = [] } = {}) => {
    dispatch({
      type: HANDLE_MICRODATA,
      queryKey,
      ...R.pick(IN_STATE_PROPS, data),
    });
  };

export default () => {
  const dispatch = useDispatch();
  const dispatchHandleMicrodata = handleMicrodata(dispatch);

  const requestArgs = useSelector(getMicrodataRequestArgs);
  const type = useSelector(getViewer);
  const locale = useSelector(getLocale);
  const frequency = useSelector(getFrequency);
  const dataflow = useSelector(getDataflow);
  const hiddenIds = useSelector(getHiddenValuesAnnotation);
  const hasMicrodata = useSelector(getHasMicrodata);

  const isMicrodata = type === MICRODATA;
  const isEnabled = hasMicrodata && isMicrodata;

  const ctx = { method: 'getMicrodata', requestArgs };

  const beforeHook = () => dispatch({ type: FLUSH_MICRODATA });

  const transformerHook = (data) => {
    return dataComputor({ locale, frequency, dataflow, hiddenIds })(data);
  };

  const successHandler = ({ data, queryKey }) => {
    dispatchHandleMicrodata({ data, queryKey });
  };

  const query = useSdmxQuery(ctx, {
    beforeHook,
    transformerHook,
    successHandler,
    isEnabled,
  });

  useDeepCompareEffect(() => {
    if (query.isSuccess && query.data && query.isEnabled) {
      dispatchHandleMicrodata({ data: query.data, queryKey: query.queryKey });
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
