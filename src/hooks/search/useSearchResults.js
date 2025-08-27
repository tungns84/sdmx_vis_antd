import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import searchApi from '../../api/search';
import { hasNoSearch, valueIcons } from '../../lib/settings/index';
import * as R from 'ramda';
import { getHasNoSearchParams, getRows } from '../../selectors/search';
import {
  getTerm,
  getConstraints,
  getLocale,
  getStart,
  getSortIndexSelected,
} from '../../selectors/router';
import { useMemo } from 'react';
import { sortedStringParams } from '../../lib/search/getStringSearchParams';
import { queryKeyFactory } from './utils.js';
import { sortByProp } from '../../utils/sort';

export default () => {
  const noParams = useSelector(getHasNoSearchParams);
  const lang = useSelector(getLocale);
  const search = useSelector(getTerm);
  const rawSort = useSelector(getSortIndexSelected);
  const constraints = useSelector(getConstraints);
  const rows = useSelector(getRows);
  const start = useSelector(getStart);

  const sort = useMemo(() => {
    return sortedStringParams(rawSort);
  }, [rawSort]);
  const facets = useMemo(() => {
    if (R.isEmpty(constraints)) return [];
    return R.pipe(
      R.values,
      sortByProp('constraintId'),
      R.reduceBy(
        (acc, { constraintId }) => acc.concat(constraintId),
        [],
        R.prop('facetId'),
      ),
    )(constraints);
  }, [constraints]);

  const ctx = {
    method: 'getSearch',
    requestArgs: { lang, search, sort, facets, rows, start },
    parserArgs: { constraints, config: { valueIcons, localeId: lang } },
  };

  const isEnabled = !hasNoSearch || !noParams;

  const queryKey = queryKeyFactory(ctx);
  const { isLoading, data } = useQuery(queryKey, () => searchApi(ctx), {
    enabled: isEnabled,
  });

  return { isLoading, term: search, localeId: lang, data, rows };
};
