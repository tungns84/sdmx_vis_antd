import * as R from 'ramda';
import dataflowParser from './dataflowParser';
import facetsParser from './facetsParser';

export default (options) => (data) => ({
  dataflows: R.map(dataflowParser({ highlighting: data.highlighting }))(
    data.dataflows,
  ),
  facets: facetsParser(options)(data.facets),
  searchResultNb: R.defaultTo(0, data.numFound),
});
