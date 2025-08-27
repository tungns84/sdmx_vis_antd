/**
 * Table Type Definitions
 * Following typescript rule: Prefer interfaces over types for object definitions
 */

import { SDMXData, TableLayout } from '../types';

// Display Options
export type DisplayMode = 'id' | 'name' | 'both';

// Header Related Types
export interface HeaderDimension {
  id: string;
  name: string;
  values: DimensionValue[];
}

export interface DimensionValue {
  id: string;
  name: string;
}

export interface HeaderValue {
  id: string;
  label: string;
  colspan: number;
}

export interface HeaderCombination {
  values: string[];
  labels: string[];
}

// Row Related Types
export interface DataRow {
  key: string;
  isSection: boolean;
  sectionText?: string;
  unit?: string;
  values: Record<string, any>;
  [key: string]: any; // For dynamic row dimension values
}

export interface SectionGroup {
  key: string;
  text: string;
  observations: any[];
}

// Table Data Structure
export interface TableData {
  rowDims: HeaderDimension[];
  headerDims: HeaderDimension[];
  headerValues: HeaderValue[];
  dataRows: DataRow[];
  numRowColumns: number;
}

// Component Props
export interface SDMXTableProps {
  data: SDMXData;
  layout: TableLayout;
  display?: DisplayMode;
  onCellClick?: (cell: CellClickEvent) => void;
  className?: string;
  testId?: string;
}

// Event Types
export interface CellClickEvent {
  row: string;
  column: string;
  value: any;
  rowData: DataRow;
  columnData: HeaderValue;
}

// Style Props
export interface TableCellStyle {
  background?: string;
  color?: string;
  padding?: string;
  textAlign?: 'left' | 'center' | 'right';
  verticalAlign?: 'top' | 'middle' | 'bottom';
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
  border?: string;
  borderRight?: string;
  borderBottom?: string;
}

export interface HeaderCellProps {
  colSpan?: number;
  style: TableCellStyle;
  children: React.ReactNode;
  scope?: 'row' | 'col';
  id?: string;
  'aria-label'?: string;
}

export interface DataCellProps {
  style: TableCellStyle;
  children: React.ReactNode;
  colSpan?: number;
  onClick?: () => void;
}

// Utility Types
export type LabelAccessor = (item: any) => string;

export type ObservationValue = string | number | null | undefined;

// Error Types
export class TableRenderError extends Error {
  constructor(message: string, public readonly details?: any) {
    super(message);
    this.name = 'TableRenderError';
  }
}

export class TableDataError extends Error {
  constructor(message: string, public readonly details?: any) {
    super(message);
    this.name = 'TableDataError';
  }
}
