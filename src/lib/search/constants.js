export default {
  FACET_LEVEL_SEPARATOR: '|',
  FACET_HIGHLIGHT_SEPARATOR: ' > ',
  FACET_VALUE_MASK: /#(.*?)#/g,
  VALUE_MASK: /#(.*?)#/,
  DATASOURCE_ID: 'datasourceId',
  AGENCY_ID: 'agencyId',
  VERSION_ID: 'version',
  DATAFLOW_ID: 'dataflowId',
};

export const DEFAULT_SORT_INDEX_SELECTED = 0;
export const sortItems = [
  { id: 'score desc', key: 'score' },
  { id: 'sortName asc', key: 'name' },
  { id: 'lastUpdated desc', key: 'index' },
];
