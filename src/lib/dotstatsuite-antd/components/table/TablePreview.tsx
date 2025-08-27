/**
 * Table Preview Component
 * Shows a visual preview of table layout with mock data
 * Following clean-code rule: Single responsibility - only handles preview rendering
 */

import React, { memo, useMemo } from 'react';
import { Typography } from 'antd';
import { TableOutlined } from '@ant-design/icons';
import { TableLayout } from '../../types';

const { Text } = Typography;

interface PreviewItem {
  id: string;
  name: string;
  count: number;
}

interface TablePreviewProps {
  layout: TableLayout;
  items: PreviewItem[];
  maxRows?: number;
  maxCols?: number;
}

// Constants for preview display
const MOCK_VALUE = 'Xxxx';
const MAX_PREVIEW_ROWS = 3;
const MAX_PREVIEW_COLS = 9;  // Allow up to 9 columns for multi-dimensional headers

/**
 * Table Preview Component
 * Renders a visual representation of the table layout
 */
export const TablePreview: React.FC<TablePreviewProps> = memo(({
  layout,
  items,
  maxRows = MAX_PREVIEW_ROWS,
  maxCols = MAX_PREVIEW_COLS,
}) => {
  // Get items for each zone
  const headerItems = useMemo(() => 
    layout.header.map(id => items.find(item => item.id === id)).filter(Boolean) as PreviewItem[],
    [layout.header, items]
  );
  
  const sectionItems = useMemo(() =>
    layout.sections.map(id => items.find(item => item.id === id)).filter(Boolean) as PreviewItem[],
    [layout.sections, items]
  );
  
  const rowItems = useMemo(() =>
    layout.rows.map(id => items.find(item => item.id === id)).filter(Boolean) as PreviewItem[],
    [layout.rows, items]
  );

  // Calculate preview dimensions
  // For multi-level headers, total columns = product of dimension value counts
  // But limit each individual dimension to 3 values for clarity
  const numHeaderCols = headerItems.length > 0 
    ? headerItems.reduce((product, item) => product * Math.min(item.count, 3), 1)
    : 1;
  
  // Calculate number of data rows to show
  // If we have row dimensions, show the max count among them (limited by maxRows)
  // If we have sections but no rows, show data rows based on section count
  // Otherwise show at least 1 row
  const numRows = rowItems.length > 0
    ? Math.min(
        Math.max(...rowItems.map(item => item.count)),
        maxRows
      )
    : sectionItems.length > 0 
      ? Math.min(
          Math.max(...sectionItems.map(item => item.count)),
          maxRows
        )
      : 1;

  // Handle empty layout
  if (headerItems.length === 0 && rowItems.length === 0) {
    return (
      <div className="table-preview-container" style={{ 
        padding: 16,
        border: '1px solid #d9d9d9',
        borderRadius: 8,
        background: '#fafafa',
        textAlign: 'center',
        minHeight: 200,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
      }}>
        <TableOutlined style={{ fontSize: 32, color: '#bfbfbf' }} />
        <Text type="secondary">
          Drag dimensions to Column or Row headers to see preview
        </Text>
      </div>
    );
  }

  // Render mock table
  return (
    <div className="table-preview-container" style={{ 
      padding: 16,
      border: '1px solid #d9d9d9',
      borderRadius: 8,
      background: '#fafafa',
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        marginBottom: 12,
        gap: 8,
      }}>
        <TableOutlined style={{ fontSize: 18, color: '#1890ff' }} />
        <Text strong>Table Preview</Text>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: 12,
          background: 'white',
        }}>
          <thead>
            {/* Column header dimensions */}
            {headerItems.length > 0 ? (
              headerItems.map((dim, dimIndex) => {
                // Calculate how many columns each value should span
                let colspan = 1;
                for (let i = dimIndex + 1; i < headerItems.length; i++) {
                  colspan *= Math.min(headerItems[i].count, 3);  // Limit each dimension to 3
                }
                
                // Calculate how many values to show for this dimension
                const dimValueCount = Math.min(dim.count, 3);
                
                // For first dimension: show each value once with appropriate colspan
                // For subsequent dimensions: repeat the pattern for each parent combination
                const valuesToShow: { value: string, colspan: number }[] = [];
                
                if (dimIndex === 0) {
                  // First dimension: each value spans over all child dimensions
                  for (let v = 0; v < dimValueCount; v++) {
                    valuesToShow.push({ value: MOCK_VALUE, colspan });
                  }
                } else {
                  // Subsequent dimensions: repeat for each parent combination
                  let numParentCombinations = 1;
                  for (let i = 0; i < dimIndex; i++) {
                    numParentCombinations *= Math.min(headerItems[i].count, 3);
                  }
                  
                  for (let p = 0; p < numParentCombinations; p++) {
                    for (let v = 0; v < dimValueCount; v++) {
                      valuesToShow.push({ value: MOCK_VALUE, colspan });
                    }
                  }
                }
                
                return (
                  <tr key={`header-${dim.id}`}>
                    {/* Column dimension name - spans over row headers */}
                    <td
                      colSpan={rowItems.length + 1}
                      style={{
                        border: '1px solid #e0e0e0',
                        padding: '4px 8px',
                        background: '#0050b3',
                        color: 'white',
                        fontWeight: 'bold',
                        fontStyle: 'italic',
                        textAlign: 'right',
                        minWidth: 60,
                      }}
                    >
                      {dim.name}
                    </td>
                    
                    {/* Column dimension values with appropriate colspan */}
                    {valuesToShow.map((item, i) => (
                      <td
                        key={`${dim.id}-val-${i}`}
                        colSpan={item.colspan}
                        style={{
                          border: '1px solid #e0e0e0',
                          padding: '4px 8px',
                          background: '#0050b3',
                          color: 'white',
                          textAlign: 'center',
                          minWidth: 50,
                        }}
                      >
                        {item.value}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              // No column headers - just create empty header row
              <tr>
                <td
                  colSpan={rowItems.length + 1 + 3}
                  style={{
                    border: '1px solid #e0e0e0',
                    padding: '4px 8px',
                    background: '#0050b3',
                    color: 'white',
                    height: 32,
                  }}
                />
              </tr>
            )}

            {/* Row dimension names - only show if we have row dimensions */}
            {rowItems.length > 0 ? (
              <tr>
                {rowItems.map((dim) => (
                  <td
                    key={`row-header-${dim.id}`}
                    style={{
                      border: '1px solid #e0e0e0',
                      padding: '4px 8px',
                      background: '#f5f5f5',
                      fontWeight: 'bold',
                      fontStyle: 'italic',
                      textAlign: 'left',
                      minWidth: 80,
                    }}
                  >
                    {dim.name}
                  </td>
                ))}
                
                {/* Separator/Unit column */}
                <td style={{
                  border: '1px solid #e0e0e0',
                  padding: '4px 8px',
                  background: '#f5f5f5',
                  width: 10,
                }}/>
                
                {/* Empty cells for data columns */}
                {Array.from({ length: numHeaderCols }).map((_, i) => (
                  <td
                    key={`empty-${i}`}
                    style={{
                      border: '1px solid #e0e0e0',
                      padding: '4px 8px',
                      background: '#f5f5f5',
                    }}
                  />
                ))}
              </tr>
            ) : (
              // When no row dimensions, still show a header row with empty cells
              <tr>
                <td style={{
                  border: '1px solid #e0e0e0',
                  padding: '4px 8px',
                  background: '#f5f5f5',
                  width: 10,
                }}/>
                {Array.from({ length: numHeaderCols }).map((_, i) => (
                  <td
                    key={`empty-header-${i}`}
                    style={{
                      border: '1px solid #e0e0e0',
                      padding: '4px 8px',
                      background: '#f5f5f5',
                    }}
                  />
                ))}
              </tr>
            )}
          </thead>

          <tbody>
            {/* Section rows */}
            {sectionItems.map((section) => {
              // Calculate proper colspan for section row
              // Should span all columns: row headers (if any) + separator + data columns
              const sectionColspan = (rowItems.length > 0 ? rowItems.length : 0) + 1 + numHeaderCols;
              
              return (
                <tr key={`section-${section.id}`}>
                  <td
                    colSpan={sectionColspan}
                    style={{
                      border: '1px solid #e0e0e0',
                      padding: '4px 8px',
                      background: '#e8e8e8',
                      fontWeight: 'bold',
                      textAlign: 'left',
                    }}
                  >
                    {section.name}: {MOCK_VALUE}
                  </td>
                </tr>
              );
            })}

            {/* Data rows */}
            {Array.from({ length: numRows }).map((_, rowIndex) => (
              <tr key={`data-row-${rowIndex}`}>
                {/* Row dimension values - only if we have row dimensions */}
                {rowItems.length > 0 ? (
                  <>
                    {rowItems.map((dim) => (
                      <td
                        key={`${dim.id}-row-${rowIndex}`}
                        style={{
                          border: '1px solid #e0e0e0',
                          padding: '4px 8px',
                          background: '#fafafa',
                          textAlign: 'left',
                        }}
                      >
                        {rowIndex < dim.count ? MOCK_VALUE : ''}
                      </td>
                    ))}
                    
                    {/* Separator column */}
                    <td style={{
                      border: '1px solid #e0e0e0',
                      padding: '4px 8px',
                      background: '#fafafa',
                      width: 10,
                    }}/>
                  </>
                ) : (
                  // When no row dimensions, just show separator
                  <td style={{
                    border: '1px solid #e0e0e0',
                    padding: '4px 8px',
                    background: '#fafafa',
                    width: 10,
                  }}/>
                )}
                
                {/* Data cells */}
                {Array.from({ length: numHeaderCols }).map((_, colIndex) => (
                  <td
                    key={`data-${rowIndex}-${colIndex}`}
                    style={{
                      border: '1px solid #e0e0e0',
                      padding: '4px 8px',
                      textAlign: 'right',
                      background: 'white',
                    }}
                  >
                    123.4
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div style={{ 
        marginTop: 12, 
        paddingTop: 12, 
        borderTop: '1px solid #e0e0e0',
      }}>
        <Text type="secondary" style={{ fontSize: 11 }}>
          Preview shows how your table will be structured with current layout
        </Text>
      </div>
    </div>
  );
});

TablePreview.displayName = 'TablePreview';
