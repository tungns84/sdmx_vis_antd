/**
 * Toolbar Type Definitions
 * Following typescript rule: Prefer interfaces over types for object definitions
 */

import { ReactNode } from 'react';

// View Types
export type ViewerType = 'overview' | 'table' | 'microdata' | 'chart' | 'map';
export type ChartType = 'line' | 'bar' | 'column' | 'area' | 'pie' | 'scatter';
export type DisplayMode = 'name' | 'id' | 'both';
export type ActionType = 'config' | 'share' | 'api' | 'download' | null;

// Toolbar Props
export interface ToolbarProps {
  /** Current viewer type */
  viewerId: ViewerType;
  /** Available chart types */
  availableCharts?: ChartType[];
  /** Current display mode for labels */
  displayMode: DisplayMode;
  /** Current active action panel */
  actionId: ActionType;
  /** Is fullscreen mode active */
  isFullscreen: boolean;
  /** Is data loading */
  isLoading?: boolean;
  /** Has microdata available */
  hasMicrodata?: boolean;
  /** Has reference area dimension */
  hasRefAreaDimension?: boolean;
  /** Viewer specific props */
  viewerProps?: any;
  /** Callback when viewer changes */
  onViewerChange: (viewer: ViewerType) => void;
  /** Callback when display mode changes */
  onDisplayModeChange: (mode: DisplayMode) => void;
  /** Callback when action changes */
  onActionChange: (action: ActionType) => void;
  /** Callback when fullscreen toggles */
  onFullscreenToggle: () => void;
  /** Filter visibility state */
  filtersVisible?: boolean;
  /** Callback when filter toggles */
  onFilterToggle?: () => void;
  /** Custom className */
  className?: string;
  /** Show/hide specific features */
  features?: ToolbarFeatures;
}

// Toolbar Features Configuration
export interface ToolbarFeatures {
  showOverview?: boolean;
  showTable?: boolean;
  showMicrodata?: boolean;
  showCharts?: boolean;
  showLabels?: boolean;
  showCustomize?: boolean;
  showShare?: boolean;
  showDownload?: boolean;
  showApi?: boolean;
  showFullscreen?: boolean;
  showFilters?: boolean;
}

// Button Props
export interface ToolbarButtonProps {
  icon?: ReactNode;
  label: string;
  tooltip?: string;
  selected?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  'aria-label'?: string;
  'aria-pressed'?: boolean;
  'aria-expanded'?: boolean;
  testId?: string;
}

// Menu Props
export interface ToolbarMenuProps {
  trigger: ReactNode;
  items: ToolbarMenuItem[];
  placement?: 'bottom' | 'bottomLeft' | 'bottomRight' | 'top' | 'topLeft' | 'topRight';
}

export interface ToolbarMenuItem {
  key: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  selected?: boolean;
  danger?: boolean;
  divider?: boolean;
  onClick?: () => void;
  children?: ToolbarMenuItem[];
}

// Download Options
export interface DownloadOption {
  key: string;
  label: string;
  format: 'excel' | 'csv' | 'json' | 'png' | 'svg';
  icon?: ReactNode;
  disabled?: boolean;
  handler: () => void;
}

// Chart Selection Props
export interface ChartSelectorProps {
  availableCharts: ChartType[];
  selectedChart?: ChartType;
  onChartSelect: (chart: ChartType) => void;
}

// Label Display Props
export interface LabelSelectorProps {
  mode: DisplayMode;
  onChange: (mode: DisplayMode) => void;
}

// Action Panel Props
export interface ActionPanelProps {
  actionId: ActionType;
  onClose: () => void;
  children?: ReactNode;
}

// Toolbar State
export interface ToolbarState {
  viewerId: ViewerType;
  displayMode: DisplayMode;
  actionId: ActionType;
  isFullscreen: boolean;
  isLoading: boolean;
}
