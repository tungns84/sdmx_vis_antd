/**
 * Toolbar Constants
 * Following clean-code rule: Constants Over Magic Numbers
 */

import {
  TableOutlined,
  LineChartOutlined,
  BarChartOutlined,
  AreaChartOutlined,
  PieChartOutlined,
  DotChartOutlined,
  AppstoreOutlined,
  TagsOutlined,
  SettingOutlined,
  ShareAltOutlined,
  DownloadOutlined,
  ApiOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  FileImageOutlined,
  FileTextOutlined,
  CodeOutlined,
  FontSizeOutlined,
  SwapOutlined,
} from '@ant-design/icons';

// Viewer Types
export const VIEWER_TYPES = {
  OVERVIEW: 'overview',
  TABLE: 'table',
  MICRODATA: 'microdata',
  CHART: 'chart',
  MAP: 'map',
} as const;

// Chart Types
export const CHART_TYPES = {
  LINE: 'line',
  BAR: 'bar',
  COLUMN: 'column',
  AREA: 'area',
  PIE: 'pie',
  SCATTER: 'scatter',
} as const;

// Display Modes
export const DISPLAY_MODES = {
  NAME: 'name',
  ID: 'id',
  BOTH: 'both',
} as const;

// Action Types
export const ACTION_TYPES = {
  CONFIG: 'config',
  SHARE: 'share',
  API: 'api',
  DOWNLOAD: 'download',
} as const;

// Download Formats
export const DOWNLOAD_FORMATS = {
  EXCEL: 'excel',
  CSV: 'csv',
  JSON: 'json',
  PNG: 'png',
  SVG: 'svg',
} as const;

// Toolbar Icons
export const TOOLBAR_ICONS = {
  VIEWERS: {
    OVERVIEW: AppstoreOutlined,
    TABLE: TableOutlined,
    MICRODATA: DotChartOutlined,
    LINE: LineChartOutlined,
    BAR: BarChartOutlined,
    AREA: AreaChartOutlined,
    PIE: PieChartOutlined,
  },
  ACTIONS: {
    LABELS: TagsOutlined,
    CUSTOMIZE: SettingOutlined,
    LAYOUT: SwapOutlined,
    SHARE: ShareAltOutlined,
    DOWNLOAD: DownloadOutlined,
    API: ApiOutlined,
    FULLSCREEN: FullscreenOutlined,
    FULLSCREEN_EXIT: FullscreenExitOutlined,
  },
  FORMATS: {
    EXCEL: FileExcelOutlined,
    CSV: FileTextOutlined,
    JSON: CodeOutlined,
    PNG: FileImageOutlined,
    PDF: FilePdfOutlined,
  },
  DISPLAY: {
    NAME: FontSizeOutlined,
    ID: CodeOutlined,
    BOTH: TagsOutlined,
  },
} as const;

// Toolbar Labels
export const TOOLBAR_LABELS = {
  VIEWERS: {
    OVERVIEW: 'Overview',
    TABLE: 'Table',
    MICRODATA: 'Microdata',
    CHARTS: 'Charts',
  },
  ACTIONS: {
    LABELS: 'Labels',
    CUSTOMIZE: 'Customize',
    LAYOUT: 'Layout',
    SHARE: 'Share',
    DOWNLOAD: 'Download',
    API: 'API Queries',
    FULLSCREEN: 'Fullscreen',
    EXIT_FULLSCREEN: 'Exit Fullscreen',
  },
  DISPLAY_MODES: {
    NAME: 'Names',
    ID: 'Codes',
    BOTH: 'Both',
  },
  DOWNLOADS: {
    EXCEL_SELECTION: 'Excel (Selection)',
    EXCEL_ALL: 'Excel (All Data)',
    CSV_SELECTION: 'CSV (Selection)',
    CSV_ALL: 'CSV (All Data)',
    JSON: 'JSON',
    PNG: 'Image (PNG)',
    SVG: 'Image (SVG)',
  },
} as const;

// Toolbar Styles
export const TOOLBAR_STYLES = {
  HEIGHT: 64,
  BUTTON_GAP: 8,
  SECTION_GAP: 16,
  ICON_SIZE: 18,
} as const;

// Keyboard Shortcuts
export const TOOLBAR_SHORTCUTS = {
  TOGGLE_FULLSCREEN: 'F11',
  DOWNLOAD: 'Ctrl+D',
  SHARE: 'Ctrl+S',
  API: 'Ctrl+A',
  CUSTOMIZE: 'Ctrl+K',
} as const;
