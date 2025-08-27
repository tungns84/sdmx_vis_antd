// Core SDMX Types
export interface SDMXDimension {
  id: string;
  name: string;
  values: SDMXDimensionValue[];
  isTimePeriod?: boolean;
  isInverted?: boolean;
  hierarchical?: boolean;
}

export interface SDMXDimensionValue {
  id: string;
  name: string;
  parent?: string;
  children?: SDMXDimensionValue[];
  level?: number;
}

export interface SDMXObservation {
  [key: string]: any;
  value?: number | string;
  attributes?: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface SDMXData {
  observations: SDMXObservation[];
  dimensions: SDMXDimension[];
  attributes?: any[];
  metadata?: any;
}

// Table Types
export interface TableLayout {
  header: string[];
  sections: string[];
  rows: string[];
}

export interface TableCell {
  value: any;
  rowSpan?: number;
  colSpan?: number;
  isHeader?: boolean;
  isEmpty?: boolean;
  metadata?: any;
  coordinates?: string[];
  attributes?: Record<string, any>;
  flags?: string[];
  notes?: string[];
}

export interface TableProps {
  data: SDMXData;
  layout: TableLayout;
  loading?: boolean;
  error?: string;
  onCellClick?: (cell: TableCell) => void;
  onLayoutChange?: (layout: TableLayout) => void;
}

// Component Props Types
export interface ViewerProps {
  type: 'table' | 'chart';
  data?: any;
  loading?: boolean;
  error?: string;
  headerProps?: any;
  footerProps?: any;
  tableProps?: TableProps;
  chartProps?: any;
}

// Layout Configuration Types
export interface LayoutItem {
  id: string;
  name: string;
  type: 'dimension' | 'combination';
  count?: number;
  isHidden?: boolean;
}

export interface LayoutConfigProps {
  items: LayoutItem[];
  layout: TableLayout;
  optionalItem?: LayoutItem;
  onChange: (layout: TableLayout) => void;
  labels?: Record<string, string>;
}

// Rules Types
export interface TransformationRules {
  getTableProps: (data: any) => TableProps;
  getChartData: (data: any) => any;
  getHeaderProps: (data: any) => any;
  getFooterProps: (data: any) => any;
}
