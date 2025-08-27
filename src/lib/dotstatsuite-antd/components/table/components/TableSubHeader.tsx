/**
 * Table Sub-Header Component (Row Dimension Names)
 * Following react rule: Keep components small and focused
 */

import React, { memo } from 'react';
import { HeaderDimension, HeaderValue } from '../../../types/table.types';
import { 
  TABLE_COLORS, 
  TABLE_SPACING, 
  TABLE_FONTS, 
  TABLE_ALIGNMENT,
  TABLE_SYMBOLS 
} from '../../../constants/table.constants';

interface TableSubHeaderProps {
  rowDims: HeaderDimension[];
  headerValues: HeaderValue[];
}

/**
 * Table Sub-Header Component
 * Renders the row dimension names and empty cells under data columns
 */
export const TableSubHeader: React.FC<TableSubHeaderProps> = memo(({ 
  rowDims, 
  headerValues 
}) => {
  return (
    <tr>
      {/* Row dimension headers */}
      {rowDims.map((dim, idx) => (
        <th
          key={`row_header_${idx}`}
          style={{
            background: TABLE_COLORS.HEADER.SECONDARY,
            color: TABLE_COLORS.HEADER.SECONDARY_DARK,
            padding: TABLE_SPACING.SECTION_PADDING,
            textAlign: TABLE_ALIGNMENT.ROW_NAME,
            verticalAlign: TABLE_ALIGNMENT.VERTICAL,
            fontWeight: TABLE_FONTS.WEIGHT.BOLD,
            fontStyle: TABLE_FONTS.STYLE.ITALIC,
            borderRight: `1px solid ${TABLE_COLORS.HEADER.BORDER_LIGHT}`,
            borderBottom: `1px solid ${TABLE_COLORS.HEADER.BORDER_LIGHT}`
          }}
          scope="col"
          aria-label={`Row dimension: ${dim?.name}`}
        >
          {dim?.name || ''}
        </th>
      ))}
      
      {/* Unit header */}
      <th 
        style={{
          background: TABLE_COLORS.HEADER.SECONDARY,
          color: TABLE_COLORS.HEADER.SECONDARY_DARK,
          padding: TABLE_SPACING.SECTION_PADDING,
          textAlign: TABLE_ALIGNMENT.UNIT,
          verticalAlign: TABLE_ALIGNMENT.VERTICAL,
          borderRight: `1px solid ${TABLE_COLORS.HEADER.BORDER_LIGHT}`,
          borderBottom: `1px solid ${TABLE_COLORS.HEADER.BORDER_LIGHT}`
        }}
        scope="col"
        aria-label="Unit of measurement"
      >
        Unit
      </th>
      
      {/* Symbols header */}
      <th 
        style={{
          background: TABLE_COLORS.HEADER.SECONDARY,
          width: '40px',
          verticalAlign: TABLE_ALIGNMENT.VERTICAL,
          borderRight: `1px solid ${TABLE_COLORS.HEADER.BORDER_LIGHT}`,
          borderBottom: `1px solid ${TABLE_COLORS.HEADER.BORDER_LIGHT}`
        }}
        scope="col"
        aria-label="Data symbols"
      >
        {/* Empty cell for symbols */}
      </th>
      
      {/* Empty cells under the data columns */}
      {headerValues.map((_, idx) => (
        <th
          key={`empty_${idx}`}
          style={{
            background: TABLE_COLORS.HEADER.SECONDARY,
            verticalAlign: TABLE_ALIGNMENT.VERTICAL,
            borderRight: idx < headerValues.length - 1 
              ? `1px solid ${TABLE_COLORS.HEADER.BORDER_LIGHT}` 
              : 'none',
            borderBottom: `1px solid ${TABLE_COLORS.HEADER.BORDER_LIGHT}`
          }}
        >
          {/* Empty cell */}
        </th>
      ))}
    </tr>
  );
});

TableSubHeader.displayName = 'TableSubHeader';
