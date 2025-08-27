// SDMX Data Types
export interface SDMXObservation {
  [key: string]: any;
  value?: number | string | boolean;
  attributes?: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface SDMXDimension {
  id: string;
  name: string;
  values: SDMXDimensionValue[];
  isTimePeriod?: boolean;
  isInverted?: boolean;
  hierarchical?: boolean;
  role?: string;
  attachment?: string;
}

export interface SDMXDimensionValue {
  id: string;
  name: string;
  parent?: string;
  children?: SDMXDimensionValue[];
  level?: number;
  order?: number;
}

export interface SDMXAttribute {
  id: string;
  name: string;
  values?: any[];
  series?: boolean;
  observation?: boolean;
  dataSet?: boolean;
  display?: boolean;
  combined?: boolean;
  relationship?: string[];
}

export interface SDMXCombination {
  id: string;
  name?: string;
  concepts: string[];
  relationship: string[];
  dimensions?: SDMXDimension[];
}

export interface SDMXMetadata {
  id: string;
  type: string;
  target?: string;
  values?: any;
}

export interface SDMXData {
  observations: SDMXObservation[];
  dimensions: SDMXDimension[];
  attributes?: SDMXAttribute[];
  combinations?: SDMXCombination[];
  metadata?: SDMXMetadata[];
  oneValueDimensions?: SDMXDimension[];
  header?: {
    id?: string;
    test?: boolean;
    prepared?: string;
    sender?: any;
    receiver?: any;
    coordinates?: any;
  };
}

// Table specific types
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

export interface TableHeaderData {
  level: number;
  data: TableCell[];
}

export interface TableSectionData {
  id: string;
  title?: string;
  data: TableCell[][];
}

export interface TableProps {
  cells: Record<string, Record<string, Record<string, TableCell[]>>>;
  headerData: TableHeaderData[];
  sectionsData: TableSectionData[];
  layout: TableLayout;
  combinations?: SDMXCombination[];
  totalCells?: number;
  truncated?: boolean;
}
