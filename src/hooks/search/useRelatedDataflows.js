import * as R from 'ramda';
import { useSelector } from 'react-redux';
import { getDataflow, getLocale } from '../../selectors/router';
import searchApi from '../../api/search';
import { useQuery } from 'react-query';
import { getDatasourceIds, hasNoSearch } from '../../lib/settings';
import { queryKeyFactory } from './utils.js';
import useSdmxRelatedDataflows from '../sdmx/useSdmxRelatedDataflows';

const IN_CACHE_PROPS = ['relatedIndexedDataflows'];

const filterIsIndexed = (isIndexedDataflows) =>
  R.addIndex(R.filter)((_, index) => {
    return R.path([index, 'searchResultNb'], isIndexedDataflows) === 1;
  });

export default () => {
  const locale = useSelector(getLocale);
  const { datasourceId } = useSelector(getDataflow);
  // datasourceId can be a datasourceId if coming to viz from search
  // but it can be a spaceId if coming from DLM!
  // hard to refactor because urls needs to change:
  // - ds for DE
  // - space for DLM
  // a space can be referenced in multiple datasources,
  // hence 'datasourceIds'
  const datasourceIds = getDatasourceIds(datasourceId);

  const { relatedDataflows = [] } = useSdmxRelatedDataflows();

  const requestsArgs = R.map(({ code, version, agencyId }) => {
    //eslint-disable-next-line
    const search = `dataflowId:\"${code}\" version:\"${version}\" agencyId:\"${agencyId}\"`;
    return {
      lang: locale,
      facets: { datasourceId: datasourceIds },
      fl: ['dataflowId'],
      rows: 0,
      search,
    };
  }, relatedDataflows);

  const ctx = { method: 'getIsIndexedDataflows', requestsArgs };

  const transformerHook = (data) => {
    if (R.isNil(data)) return { relatedIndexedDataflows: [] };
    const relatedIndexedDataflows = filterIsIndexed(data)(relatedDataflows);

    return {
      relatedIndexedDataflows: R.isEmpty(relatedIndexedDataflows)
        ? relatedDataflows
        : relatedIndexedDataflows,
    };
  };

  const isEnabled = !hasNoSearch || !R.isEmpty(relatedDataflows);

  const queryKey = queryKeyFactory(ctx);
  const query = useQuery(queryKey, () => searchApi(ctx).then(transformerHook), {
    enabled: isEnabled,
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
