import * as R from 'ramda';
import facetsParser from './facetsParser';

export default (parserArgs) => (data) => {
  const locale = parserArgs?.config?.localeId;
  const configuredFacetsParser = facetsParser({
    config: R.propOr({}, 'config', parserArgs),
  });

  if (R.isEmpty(R.propOr([], 'facetIds', parserArgs)))
    return { locale, facets: configuredFacetsParser(data.facets) };

  const homeFacets = R.pick(parserArgs.facetIds, data.facets);
  const parsedHomeFacets = configuredFacetsParser(homeFacets);

  return { locale, facets: parsedHomeFacets };
};
