/**
 * Table Body Component
 * Following react rule: Keep components small and focused
 */

import React, { memo, useCallback } from 'react';
import { 
  DataRow, 
  HeaderDimension, 
  HeaderValue,
  CellClickEvent
} from '../../../types/table.types';
import { 
  TABLE_COLORS, 
  TABLE_SPACING, 
  TABLE_FONTS, 
  TABLE_ALIGNMENT,
  TABLE_SYMBOLS,
  NUMBER_FORMAT 
} from '../../../constants/table.constants';

interface TableBodyProps {
  dataRows: DataRow[];
  rowDims: HeaderDimension[];
  headerValues: HeaderValue[];
  numRowColumns: number;
  onCellClick?: (event: CellClickEvent) => void;
}

/**
 * Formats numeric values for display
 */
const formatNumber = (value: any): string => {
  if (value == null) return '';
  if (typeof value !== 'number') return String(value);
  
  return value.toLocaleString(NUMBER_FORMAT.LOCALE, {
    minimumFractionDigits: NUMBER_FORMAT.MIN_FRACTION_DIGITS,
    maximumFractionDigits: NUMBER_FORMAT.MAX_FRACTION_DIGITS,
  }).replace(/,/g, NUMBER_FORMAT.THOUSAND_SEPARATOR);
};

/**
 * Section Row Component
 */
const SectionRow: React.FC<{ 
  row: DataRow; 
  colSpan: number 
}> = memo(({ row, colSpan }) => (
  <td
    colSpan={colSpan}
    style={{
      background: TABLE_COLORS.SECTION.BACKGROUND,
      padding: TABLE_SPACING.SECTION_PADDING,
      fontWeight: TABLE_FONTS.WEIGHT.BOLD,
      fontStyle: TABLE_FONTS.STYLE.ITALIC,
      textAlign: TABLE_ALIGNMENT.SECTION,
      verticalAlign: TABLE_ALIGNMENT.VERTICAL,
      borderBottom: `1px solid ${TABLE_COLORS.SECTION.BORDER}`
    }}
    role="heading"
    aria-level={3}
  >
    {row.sectionText}
  </td>
));

SectionRow.displayName = 'SectionRow';

/**
 * Data Row Component
 */
const DataRowComponent: React.FC<{ 
  row: DataRow; 
  rowDims: HeaderDimension[];
  headerValues: HeaderValue[];
  onCellClick?: (event: CellClickEvent) => void;
}> = memo(({ row, rowDims, headerValues, onCellClick }) => {
  const handleCellClick = useCallback((header: HeaderValue, value: any) => {
    if (onCellClick) {
      onCellClick({
        row: row.key,
        column: header.id,
        value,
        rowData: row,
        columnData: header
      });
    }
  }, [onCellClick, row]);

  return (
    <>
      {/* Row dimension values */}
      {rowDims.map((dim, idx) => (
        <td
          key={`row_${idx}`}
          style={{
            background: TABLE_COLORS.ROW.BACKGROUND,
            color: TABLE_COLORS.HEADER.SECONDARY_DARK,
            padding: TABLE_SPACING.CELL_PADDING,
            textAlign: TABLE_ALIGNMENT.ROW_VALUE,
            verticalAlign: TABLE_ALIGNMENT.VERTICAL,
            borderRight: `1px solid ${TABLE_COLORS.ROW.BORDER}`,
            borderBottom: `1px solid ${TABLE_COLORS.DATA.BORDER}`
          }}
          role="rowheader"
        >
          {row[`row_${dim?.id}`] || ''}
        </td>
      ))}
      
      {/* Unit cell */}
      <td 
        style={{
          background: TABLE_COLORS.ROW.BACKGROUND,
          color: TABLE_COLORS.HEADER.SECONDARY_DARK,
          padding: TABLE_SPACING.CELL_PADDING,
          textAlign: TABLE_ALIGNMENT.UNIT,
          verticalAlign: TABLE_ALIGNMENT.VERTICAL,
          borderRight: `1px solid ${TABLE_COLORS.ROW.BORDER}`,
          borderBottom: `1px solid ${TABLE_COLORS.DATA.BORDER}`
        }}
      >
        {row.unit}
      </td>
      
      {/* Symbol cell */}
      <td 
        style={{
          background: TABLE_COLORS.DATA.BACKGROUND,
          padding: TABLE_SPACING.CELL_PADDING,
          textAlign: TABLE_ALIGNMENT.UNIT,
          verticalAlign: TABLE_ALIGNMENT.VERTICAL,
          borderRight: `1px solid ${TABLE_COLORS.ROW.BORDER}`,
          borderBottom: `1px solid ${TABLE_COLORS.DATA.BORDER}`
        }}
      >
        {TABLE_SYMBOLS.SYMBOL_PLACEHOLDER}
      </td>
      
      {/* Data cells */}
      {headerValues.map((header, idx) => {
        const value = row.values[header.id];
        const formatted = formatNumber(value);
        
        return (
          <td
            key={`data_${idx}`}
            style={{
              background: TABLE_COLORS.DATA.BACKGROUND,
              color: TABLE_COLORS.DATA.TEXT,
              padding: TABLE_SPACING.CELL_PADDING,
              textAlign: TABLE_ALIGNMENT.DATA,
              verticalAlign: TABLE_ALIGNMENT.VERTICAL,
              borderRight: idx < headerValues.length - 1 
                ? `1px solid ${TABLE_COLORS.DATA.BORDER}` 
                : 'none',
              borderBottom: `1px solid ${TABLE_COLORS.DATA.BORDER}`,
              cursor: onCellClick ? 'pointer' : 'default'
            }}
            onClick={onCellClick ? () => handleCellClick(header, value) : undefined}
            role="gridcell"
            aria-label={`Value: ${formatted}`}
          >
            {formatted}
          </td>
        );
      })}
    </>
  );
});

DataRowComponent.displayName = 'DataRowComponent';

/**
 * Table Body Component
 * Renders all data rows including sections
 */
export const TableBody: React.FC<TableBodyProps> = memo(({ 
  dataRows, 
  rowDims, 
  headerValues,
  numRowColumns,
  onCellClick 
}) => {
  return (
    <tbody>
      {dataRows.map((row) => (
        <tr key={row.key} role="row">
          {row.isSection ? (
            <SectionRow 
              row={row} 
              colSpan={numRowColumns + headerValues.length} 
            />
          ) : (
            <DataRowComponent
              row={row}
              rowDims={rowDims}
              headerValues={headerValues}
              onCellClick={onCellClick}
            />
          )}
        </tr>
      ))}
    </tbody>
  );
});

TableBody.displayName = 'TableBody';
