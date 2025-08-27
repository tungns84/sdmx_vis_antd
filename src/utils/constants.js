export const PANEL_USED_FILTERS = 'PANEL_USED_FILTERS';
export const PANEL_PERIOD = 'PANEL_PERIOD';
export const PANEL_CONTENT_CONSTRAINTS = 'PANEL_CONTENT_CONSTRAINTS';
export const PANEL_NARROW_FILTER = 'PANEL_NARROW_FILTER';
export const PANEL_SEARCH_CURRENT = 'search-used';
export const PANEL_MORE_FILTERS = 'more-filers';
export const PANEL_MORE_RELATED_DATAFLOWS = 'more-related-dataflows';
export const FILENAME_MAX_LENGTH = 100;
export const SMALL_SIDE_WIDTH = 342;
export const SIDE_WIDTH = 380;
// space (pourcentage) between the side of the screen and the page
export const MARGE_SIZE = 10;
export const MARGE_RATIO = 1 - (MARGE_SIZE * 2) / 100;

export const CHART_IDS = {
  BARCHART: 'BarChart',
  ROWCHART: 'RowChart',
  SCATTERCHART: 'ScatterChart',
  HORIZONTALSYMBOLCHART: 'HorizontalSymbolChart',
  VERTICALSYMBOLCHART: 'VerticalSymbolChart',
  TIMELINECHART: 'TimelineChart',
  STACKEDBARCHART: 'StackedBarChart',
  STACKEDROWCHART: 'StackedRowChart',
  CHOROPLETHCHART: 'ChoroplethChart',
};
export const TABLE = 'table';
export const OVERVIEW = 'overview';
export const MICRODATA = 'microdata';
export const EXCEL = 'excel';
export const PNG = 'png';

export const keysBackwardCompatibilityMapSearchToState = {
  lt: 'layout',
};

export const keysMapStateToSearch = {
  locale: 'lc',
  facet: 'fc',
  term: 'tm',
  start: 'pg',
  constraints: 'fs',
  dataquery: 'dq',
  hasAccessibility: 'ac',
  hasDataAvailability: 'av',
  viewer: 'vw',
  period: 'pd',
  display: 'lb',
  time: 'to',
  dataflow: 'df',
  layout: 'ly',
  lastNObservations: 'lo',
  map: 'mp',
  microdataConstraints: 'mdc',
  sortIndexSelected: 'si',
  searchResultNb: 'snb',
  bypass: 'bp',
  lastNMode: 'lom',
};

export const keysMapMap = {
  mapId: 'id',
  levelId: 'lv',
};

export const keysMapDataflow = {
  datasourceId: 'ds',
  dataflowId: 'id',
  agencyId: 'ag',
  version: 'vs',
};

export const keysMapLayout = {
  sections: 'rs',
  rows: 'rw',
  header: 'cl',
};

export const DISPLAY_LABEL = 'label';
export const DISPLAY_CODE = 'code';
export const DISPLAY_BOTH = 'both';
export const DISPLAYS = [DISPLAY_LABEL, DISPLAY_CODE, DISPLAY_BOTH];

export const keysMapDisplay = {
  [DISPLAY_LABEL]: 'nm',
  [DISPLAY_CODE]: 'id',
  [DISPLAY_BOTH]: 'bt',
};

export const keysMapViewer = {
  [TABLE]: 'tb',
  [OVERVIEW]: 'ov',
  [MICRODATA]: 'md',
  [CHART_IDS.BARCHART]: 'br',
  [CHART_IDS.ROWCHART]: 'rw',
  [CHART_IDS.SCATTERCHART]: 'sp',
  [CHART_IDS.HORIZONTALSYMBOLCHART]: 'hs',
  [CHART_IDS.VERTICALSYMBOLCHART]: 'vs',
  [CHART_IDS.TIMELINECHART]: 'tl',
  [CHART_IDS.STACKEDBARCHART]: 'sb',
  [CHART_IDS.STACKEDROWCHART]: 'sr',
  [CHART_IDS.CHOROPLETHCHART]: 'cp',
};

export const FEEDBACK = 'feedback';
export const QUESTION = 'question';
export const PROBLEM = 'problem';

export const RIGHT = 'right';
export const LEFT = 'left';

export const expirationPeriod = 4;
