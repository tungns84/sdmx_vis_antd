import * as R from 'ramda';
import { useMemo } from 'react';
import { rejectIrrelevantFacets } from '../lib/search';
import { sortByIndex, sortByLabel } from '../utils/sort';
import { useSelector } from 'react-redux';
import { getLocale } from '../selectors/router';

const partitionFacets = (config) => {
  const pinnedFacetIds = R.propOr([], 'pinnedFacetIds', config);
  const excludedFacetIds = R.propOr([], 'excludedFacetIds', config);

  return R.reduce(
    ([pinned, included], facet) => {
      if (R.includes(facet.id, excludedFacetIds)) return [pinned, included];
      const index = R.indexOf(facet.id, pinnedFacetIds);
      if (R.equals(index, -1)) return [pinned, [...included, facet]];
      return [[...pinned, { ...facet, isPinned: true, index }], included];
    },
    [[], []],
  );
};

export const useSearchFacets = (
  facets,
  count,
  searchConfig,
  defaultFacetsNumber,
) => {
  const locale = useSelector(getLocale);

  const [expandedFacets, hiddenFacets] = useMemo(() => {
    if (!facets) return [[], []];

    return R.pipe(
      rejectIrrelevantFacets({ count, locale }),
      partitionFacets(searchConfig),
      // sortBy pinned & included facets
      ([pinned, included]) =>
        R.concat(sortByIndex(pinned), sortByLabel(locale)(included)),
      // split facets regarding defaultFacetsNumber:
      // - pinned facets can be in 'hidden'
      // - unpinned facets can be in 'expanded'
      R.splitAt(defaultFacetsNumber),
    )(facets);
  }, [count, facets]);

  return [expandedFacets, hiddenFacets];
};
