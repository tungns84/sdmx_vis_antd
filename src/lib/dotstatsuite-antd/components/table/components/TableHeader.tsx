/**
 * Table Header Component
 * Following react rule: Keep components small and focused
 */

import React, { memo, useMemo } from 'react';
import { 
  HeaderDimension, 
  LabelAccessor,
  HeaderCellProps 
} from '../../../types/table.types';
import { 
  TABLE_COLORS, 
  TABLE_SPACING, 
  TABLE_FONTS, 
  TABLE_ALIGNMENT 
} from '../../../constants/table.constants';

interface TableHeaderProps {
  headerDims: HeaderDimension[];
  numRowColumns: number;
  labelAccessor: LabelAccessor;
}

/**
 * Renders a single header cell
 */
const HeaderCell: React.FC<HeaderCellProps> = memo(({ 
  colSpan, 
  style, 
  children, 
  scope = 'col',
  id,
  'aria-label': ariaLabel 
}) => (
  <th
    colSpan={colSpan}
    style={style}
    scope={scope}
    id={id}
    aria-label={ariaLabel}
  >
    {children}
  </th>
));

HeaderCell.displayName = 'HeaderCell';

/**
 * Calculates values to display for a dimension level
 */
const calculateDimensionValues = (
  dim: HeaderDimension,
  dimIndex: number,
  headerDims: HeaderDimension[],
  labelAccessor: LabelAccessor
) => {
  // Calculate colspan for each value
  let colspan = 1;
  for (let i = dimIndex + 1; i < headerDims.length; i++) {
    colspan *= headerDims[i]?.values?.length || 1;
  }
  
  // Get the values to display at this level
  const valuesToShow: any[] = [];
  
  if (dimIndex === 0) {
    // First dimension: show each unique value once
    dim?.values?.forEach((value: any) => {
      valuesToShow.push({
        id: value.id,
        label: labelAccessor(value),
        colspan
      });
    });
  } else {
    // Subsequent dimensions: repeat for each combination of all parent dimensions
    let numParentCombinations = 1;
    for (let i = 0; i < dimIndex; i++) {
      numParentCombinations *= headerDims[i]?.values?.length || 1;
    }
    
    // Repeat the values for each parent combination
    for (let i = 0; i < numParentCombinations; i++) {
      dim?.values?.forEach((value: any) => {
        valuesToShow.push({
          id: value.id,
          label: labelAccessor(value),
          colspan
        });
      });
    }
  }
  
  return valuesToShow;
};

/**
 * Table Header Component
 * Renders multi-level column headers with proper hierarchy
 */
export const TableHeader: React.FC<TableHeaderProps> = memo(({ 
  headerDims, 
  numRowColumns,
  labelAccessor 
}) => {
  // Memoize header rows calculation
  const headerRows = useMemo(() => {
    return headerDims.map((dim, dimIndex) => {
      const valuesToShow = calculateDimensionValues(dim, dimIndex, headerDims, labelAccessor);
      return { dim, dimIndex, valuesToShow };
    });
  }, [headerDims, labelAccessor]);

  return (
    <>
      {/* Create one row for each column dimension */}
      {headerRows.map(({ dim, dimIndex, valuesToShow }) => (
        <tr key={`header_row_${dimIndex}`}>
          {/* Dimension name cell */}
          <HeaderCell
            colSpan={numRowColumns}
            style={{
              background: TABLE_COLORS.HEADER.PRIMARY,
              color: TABLE_COLORS.HEADER.PRIMARY_LIGHT,
              padding: TABLE_SPACING.HEADER_PADDING,
              textAlign: TABLE_ALIGNMENT.COLUMN_NAME,
              verticalAlign: TABLE_ALIGNMENT.VERTICAL,
              fontWeight: TABLE_FONTS.WEIGHT.BOLD,
              fontStyle: TABLE_FONTS.STYLE.ITALIC,
              borderRight: `1px solid ${TABLE_COLORS.HEADER.BORDER}`,
              borderBottom: `1px solid ${TABLE_COLORS.HEADER.BORDER}`
            }}
            aria-label={`Column dimension: ${dim?.name}`}
          >
            {dim?.name || ''}
          </HeaderCell>
          
          {/* Dimension values */}
          {valuesToShow.map((value, idx) => (
            <HeaderCell
              key={`header_${dimIndex}_${idx}`}
              colSpan={value.colspan}
              style={{
                background: TABLE_COLORS.HEADER.PRIMARY,
                color: TABLE_COLORS.HEADER.PRIMARY_LIGHT,
                padding: TABLE_SPACING.SECTION_PADDING,
                textAlign: TABLE_ALIGNMENT.COLUMN_VALUE,
                verticalAlign: TABLE_ALIGNMENT.VERTICAL,
                fontWeight: TABLE_FONTS.WEIGHT.NORMAL,
                borderRight: idx < valuesToShow.length - 1 
                  ? `1px solid ${TABLE_COLORS.HEADER.BORDER}` 
                  : 'none',
                borderBottom: `1px solid ${TABLE_COLORS.HEADER.BORDER}`
              }}
              aria-label={`${dim?.name}: ${value.label}`}
            >
              {value.label}
            </HeaderCell>
          ))}
        </tr>
      ))}
    </>
  );
});

TableHeader.displayName = 'TableHeader';
