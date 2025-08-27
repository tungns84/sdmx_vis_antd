import {
  Bar as BarIcon,
  Row as RowIcon,
  Scatter as ScatterIcon,
  HSymbol as HSymbolIcon,
  VSymbol as VSymbolIcon,
  Timeline as TimelineIcon,
  StackedBar as StackedBarIcon,
  StackedRow as StackedRowIcon,
} from '@sis-cc/dotstatsuite-visions';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import { CHART_IDS, TABLE } from '../utils/constants';

export const getViewerLink = (endPoint, id) => `${endPoint}?chartId=${id}`;

export const DATE_FORMAT = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
};

export const icons = {
  [TABLE]: TableChartOutlinedIcon,
  [CHART_IDS.BARCHART]: BarIcon,
  [CHART_IDS.ROWCHART]: RowIcon,
  [CHART_IDS.SCATTERCHART]: ScatterIcon,
  [CHART_IDS.HORIZONTALSYMBOLCHART]: HSymbolIcon,
  [CHART_IDS.VERTICALSYMBOLCHART]: VSymbolIcon,
  [CHART_IDS.TIMELINECHART]: TimelineIcon,
  [CHART_IDS.STACKEDBARCHART]: StackedBarIcon,
  [CHART_IDS.STACKEDROWCHART]: StackedRowIcon,
};
