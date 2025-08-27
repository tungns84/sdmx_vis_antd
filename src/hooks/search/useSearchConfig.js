import { useQuery } from 'react-query';
import searchApi from '../../api/search';
import {
  hasNoSearch,
  homeFacetIds,
  valueIcons,
} from '../../lib/settings/index';
import { queryKeyFactory } from './utils.js';

export default ({ localeId }) => {
  const ctx = {
    method: 'getConfig',
    requestArgs: { lang: localeId, rows: 0, fl: homeFacetIds },
    parserArgs: { facetIds: homeFacetIds, config: { valueIcons, localeId } },
  };

  const isEnabled = !hasNoSearch;

  const queryKey = queryKeyFactory(ctx);
  return useQuery(queryKey, () => searchApi(ctx), { enabled: isEnabled });
};
