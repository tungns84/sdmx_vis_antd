import { useDispatch, useSelector } from 'react-redux';
import { getStructureRequestArgs } from '../selectors/sdmx';
import { HANDLE_EXTERNAL_REFERENCE, HANDLE_STRUCTURE } from '../ducks/sdmx';
import useSdmxQuery from './sdmx/useSdmxQuery';
import { getDataflowExternalReference } from '@sis-cc/dotstatsuite-sdmxjs';
import { getSpaceFromUrl } from '../lib/settings';
import * as R from 'ramda';
import {
  getConstraints,
  getDataflow,
  getDataquery,
  getHasDataAvailability,
  getHasLastNObservations,
  getLastNMode,
  getLastNObservations,
  getLocale,
  getPeriod,
  getTableLayout,
} from '../selectors/router';
import { structureComputor } from '../lib/sdmx/computors/structure';
import useSdmxHCL from './sdmx/useSdmxHCL';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { useQueryClient } from 'react-query';
import useSearchResults from './search/useSearchResults';
import { isSameDataflow } from './utils.js';

// assuming that in_state props are not in cache because
// of the usage of selector(s)
const IN_STATE_PROPS = [
  'dataRequestRange',
  'hiddenValuesAnnotation',
  'dimensions',
  'attributes',
  'microdataDimensionId',
  'name',
  'hierarchies',
  'combinationsDefinition',
  'isAvailabilityDisabled',
  'hCodes',
  'defaultLayoutIds',
  'actualContentConstraints',
  'constraintId',
  'timePeriod',
];

const IN_CACHE_PROPS = [
  'dataflowId',
  'version',
  'agencyId',
  'relatedData',
  'dsdIdentifiers',
  'automatedSelections',
  'externalResources',
  'dataflowDescription',
  'hierarchySchemes',
  'textAlign',
  'isIncreased',
  'observationsType',
];

const IN_ROUTE_PROPS = [
  'dataquery',
  'lastNMode',
  'lastNObservations',
  'period',
  'time',
];

const handleExternalReference =
  (dispatch) =>
  ({ externalReference, queryKey = [] }) => {
    const externalReferenceSpace = R.pipe(
      R.path(['datasource', 'url']),
      getSpaceFromUrl,
    )(externalReference);

    return dispatch({
      type: HANDLE_EXTERNAL_REFERENCE,
      queryKey,
      externalReference: {
        ...externalReference,
        datasource: externalReferenceSpace || externalReference.datasource,
      },
    });
  };

const handleStructure =
  (dispatch) =>
  ({ data = {}, queryKey = [], currentProps } = {}) => {
    const routerData = R.isNil(currentProps)
      ? data
      : data.preparedHclDependentsComputor(currentProps)(data.hierarchies);
    return dispatch({
      type: HANDLE_STRUCTURE,
      structure: R.pick(IN_STATE_PROPS, data),
      queryKey,
      replaceStraigthHistory: {
        pathname: '/vis',
        payload: {
          ...R.pick(IN_ROUTE_PROPS, routerData),
          time: data.time,
          filter: null,
        },
      },
    });
  };

export default () => {
  const dispatch = useDispatch();
  const { data: searchData } = useSearchResults();
  const dispatchHandleStructure = handleStructure(dispatch);
  const dispatchHandleExternalReference = handleExternalReference(dispatch);

  const requestArgs = useSelector(getStructureRequestArgs);
  const locale = useSelector(getLocale);
  const dataflow = useSelector(getDataflow);
  const currentDataquery = useSelector(getDataquery);
  const constraints = useSelector(getConstraints);
  const hasDataAvailability = useSelector(getHasDataAvailability);
  const currentPeriod = useSelector(getPeriod);
  const hasLastNObservations = useSelector(getHasLastNObservations);
  const currentLastNMode = useSelector(getLastNMode);
  const currentLastNObservations = useSelector(getLastNObservations);
  const currentLayout = useSelector(getTableLayout);

  const highlightedContraints = R.pipe(
    R.propOr([], 'dataflows'),
    R.find((df) => isSameDataflow(df, dataflow)),
    R.propOr([], 'highlights'),
  )(searchData);

  const currentProps = {
    currentDataquery,
    constraints,
    highlightedContraints,
    hasDataAvailability,
    currentPeriod,
    hasLastNObservations,
    currentLastNMode,
    currentLastNObservations,
  };

  const ctx = { method: 'getStructure', requestArgs };

  const transformerHook = (structure) => {
    const externalReference = getDataflowExternalReference(structure);
    if (!R.isNil(externalReference)) {
      return { externalReference };
    }

    const computedStructure = structureComputor({
      locale,
      dataflow,
      currentLayout,
    })(structure);

    if (!R.isEmpty(computedStructure?.hclRefs)) return { ...computedStructure };

    const hclDependents =
      computedStructure.preparedHclDependentsComputor(currentProps)();

    return { ...computedStructure, ...hclDependents, externalReference };
  };

  const successHandler = ({ data, queryKey }) => {
    if (!R.isNil(data?.externalReference)) {
      return dispatchHandleExternalReference({
        externalReference: data?.externalReference,
        queryKey,
      });
    }

    if (!R.isEmpty(data?.hclRefs)) return;

    dispatchHandleStructure({ data, queryKey });
  };

  //const beforeHook = () => dispatch({ type: FLUSH_STRUCTURE });

  const query = useSdmxQuery(ctx, {
    transformerHook,
    successHandler,
    //beforeHook,
  });
  const queryClient = useQueryClient();

  const afterHook = ({ parsed: hcls, hCodes }) => {
    const hclDependents =
      query.data?.preparedHclDependentsComputor(currentProps)(hcls);
    queryClient.setQueryData(
      query.queryKey,
      R.pipe(
        R.dissoc('hclRefs'),
        R.assoc('hierarchies', hcls),
        R.assoc('hCodes', hCodes),
        R.mergeRight(hclDependents),
      ),
    );
    const data = queryClient.getQueryData(query.queryKey);
    dispatchHandleStructure({ data, queryKey: query.queryKey });
  };

  useSdmxHCL({ hclRefs: query.data?.hclRefs, afterHook });

  useDeepCompareEffect(() => {
    if (query.isSuccess && query.data && query.isEnabled) {
      const hasHCLs =
        !R.isNil(query.data.hclRefs) && !R.isEmpty(query.data.hclRefs);
      const isIncomplete = hasHCLs && !query.data.hierarchies;
      if (isIncomplete) return;
      if (!R.isNil(query.data?.externalReference)) {
        dispatchHandleExternalReference({
          externalReference: query.data?.externalReference,
          queryKey: query.queryKey,
        });
        return;
      }
      dispatchHandleStructure({
        data: query.data,
        queryKey: query.queryKey,
        currentProps,
      });
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
