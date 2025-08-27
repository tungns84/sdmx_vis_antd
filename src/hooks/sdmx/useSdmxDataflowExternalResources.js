import * as R from 'ramda';
import { useSelector } from 'react-redux';
import { getLocale } from '../../selectors/router';
import {
  getExternalResources,
  parseExternalReference,
  getRequestArgs as sdmxjsGetRequestArgs,
} from '@sis-cc/dotstatsuite-sdmxjs';
import useSdmxQuery from './useSdmxQuery';
import { getDatasource } from '../../components/search/utils';

const getRequestArgs = ({ dataflowResult, externalReference, locale }) => {
  const { agencyId, dataflowId, version } = dataflowResult;

  return sdmxjsGetRequestArgs({
    identifiers: externalReference?.identifiers || {
      agencyId,
      code: dataflowId,
      version,
    },
    datasource: getDatasource({ dataflowResult, externalReference }),
    type: 'dataflow',
    withReferences: false,
    overview: true,
    locale,
  });
};

const IN_CACHE_PROPS = ['dataflowExternalResources', 'externalReference'];

// dataflow result is not an sdmx dataflow,
// it's a search result that has common props with an sdmx dataflow
// the main difference and trap for the developer is the space/datasource
export default ({ dataflowResult, isEnabled }) => {
  const externalReference = parseExternalReference(
    {
      isExternalReference: !R.isNil(dataflowResult.externalUrl),
      links: [{ rel: 'external', href: dataflowResult.externalUrl }],
    },
    'dataflow',
  );

  const locale = useSelector(getLocale);
  const requestArgs = getRequestArgs({
    dataflowResult,
    externalReference,
    locale,
  });

  const ctx = { method: 'getDataflowExternalResources', requestArgs };
  const transformerHook = (structure) => {
    return {
      dataflowExternalResources: getExternalResources(structure),
    };
  };
  const query = useSdmxQuery(ctx, {
    transformerHook,
    isForceEnabled: isEnabled,
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
