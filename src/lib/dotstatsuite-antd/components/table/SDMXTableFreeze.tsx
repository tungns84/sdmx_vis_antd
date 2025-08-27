import React, { useMemo, useCallback, useRef, useEffect, useState } from 'react';
import { SDMXData, TableLayout } from '../../types';
import SDMXCell, { SDMXCellData, ObservationFlag } from './SDMXCell';

interface SDMXTableProps {
  data: SDMXData;
  layout: TableLayout;
  loading?: boolean;
  error?: string;
  display?: 'id' | 'name' | 'both';
  freezeColumns?: number; // Number of columns to freeze from the left
  freezeHeader?: boolean; // Whether to freeze the header
}

const SDMXTableFreeze: React.FC<SDMXTableProps> = ({
  data,
  layout,
  loading = false,
  error,
  display = 'name',
  freezeColumns = 0,
  freezeHeader = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [columnWidths, setColumnWidths] = useState<number[]>([]);

  // Label accessor
  const labelAccessor = useCallback((item: any) => {
    if (!item) return '';
    if (display === 'id') return item.id || '';
    if (display === 'name') return item.name || item.id || '';
    if (item.name && item.id && item.name !== item.id) {
      return `${item.name} (${item.id})`;
    }
    return item.name || item.id || '';
  }, [display]);

  // Build table data
  const tableData = useMemo(() => {
    if (!data?.observations?.length) {
      return null;
    }

    // Get dimensions
    const rowDims = layout.rows.map(id => 
      data.dimensions.find(d => d.id === id)
    ).filter(Boolean);
    
    const headerDims = layout.header.map(id => 
      data.dimensions.find(d => d.id === id)
    ).filter(Boolean);

    // Calculate colspan for first cell
    const numRowColumns = rowDims.length + 2; // +1 Unit, +1 symbols

    // Get header values - handle multiple dimensions
    const headerValues: any[] = [];
    const headerCombinations = new Map<string, any[]>();
    
    if (headerDims.length > 0) {
      // Get all unique combinations of header dimension values
      data.observations.forEach(obs => {
        const headerKey = headerDims.map(dim => obs[dim?.id || '']).join('_');
        if (!headerCombinations.has(headerKey)) {
          const combination = headerDims.map(dim => {
            const valueId = obs[dim?.id || ''];
            const dimValue = dim?.values?.find((v: any) => v.id === valueId);
            return {
              dimId: dim?.id,
              dimName: dim?.name,
              valueId: valueId,
              valueName: labelAccessor(dimValue)
            };
          });
          headerCombinations.set(headerKey, combination);
        }
      });
      
      // Sort combinations
      const sortedCombinations = Array.from(headerCombinations.entries()).sort((a, b) => 
        a[0].localeCompare(b[0])
      );
      
      sortedCombinations.forEach(([key, combination]) => {
        headerValues.push({
          id: key,
          combination: combination,
          label: combination.map(c => c.valueName).join(' / ')
        });
      });
    }

    // Build data rows
    const dataRows: any[] = [];
    
    if (layout.sections.length > 0) {
      const sectionGroups = new Map<string, any[]>();
      
      data.observations.forEach(obs => {
        const sectionKey = layout.sections.map(id => obs[id]).join('_');
        if (!sectionGroups.has(sectionKey)) {
          sectionGroups.set(sectionKey, []);
        }
        sectionGroups.get(sectionKey)!.push(obs);
      });
      
      sectionGroups.forEach((observations, sectionKey) => {
        // Add section header
        const sectionDims = layout.sections.map(id => {
          const dim = data.dimensions.find(d => d.id === id);
          const valueId = observations[0][id];
          const dimValue = dim?.values?.find((v: any) => v.id === valueId);
          return {
            dimName: dim?.name,
            valueName: labelAccessor(dimValue)
          };
        });
        
        dataRows.push({
          type: 'section',
          key: sectionKey,
          label: sectionDims.map(d => `${d.dimName}: ${d.valueName}`).join(', ')
        });

        // Group by row dimensions within section
        const rowGroups = new Map<string, any[]>();
        
        observations.forEach(obs => {
          const rowKey = rowDims.map(dim => obs[dim?.id || '']).join('_');
          if (!rowGroups.has(rowKey)) {
            rowGroups.set(rowKey, []);
          }
          rowGroups.get(rowKey)!.push(obs);
        });
        
        rowGroups.forEach((rowObs, rowKey) => {
          const rowData: any = {
            type: 'data',
            key: rowKey,
            values: {}
          };
          
          // Add row dimension values
          rowDims.forEach(dim => {
            const valueId = rowObs[0][dim?.id || ''];
            const dimValue = dim?.values?.find((v: any) => v.id === valueId);
            rowData[dim?.id || ''] = labelAccessor(dimValue);
          });
          
          // Add observation values mapped by header key
          rowObs.forEach(obs => {
            const headerKey = headerDims.map(dim => obs[dim?.id || '']).join('_');
            
            // Extract observation metadata
            const cellData: SDMXCellData = {
              value: obs.value,
              flags: [],
              status: undefined,
              unit: obs.UNIT_MEASURE || obs.UNIT || '',
              decimals: obs.DECIMALS ? parseInt(obs.DECIMALS) : undefined,
              multiplier: obs.UNIT_MULT ? parseInt(obs.UNIT_MULT) : undefined
            };
            
            // Process observation flags
            if (obs.OBS_FLAG) {
              cellData.flags = [{ code: obs.OBS_FLAG, label: obs.OBS_FLAG }];
            }
            if (obs.FOOTNOTE) {
              cellData.footnote = obs.FOOTNOTE;
            }
            if (obs.OBS_STATUS) {
              cellData.status = obs.OBS_STATUS;
            }
            
            rowData.values[headerKey] = cellData;
          });
          
          dataRows.push(rowData);
        });
      });
    } else {
      // No sections - just group by row dimensions
      const rowGroups = new Map<string, any[]>();
      
      data.observations.forEach(obs => {
        const rowKey = rowDims.map(dim => obs[dim?.id || '']).join('_');
        if (!rowGroups.has(rowKey)) {
          rowGroups.set(rowKey, []);
        }
        rowGroups.get(rowKey)!.push(obs);
      });
      
      rowGroups.forEach((rowObs, rowKey) => {
        const rowData: any = {
          type: 'data',
          key: rowKey,
          values: {}
        };
        
        // Add row dimension values
        rowDims.forEach(dim => {
          const valueId = rowObs[0][dim?.id || ''];
          const dimValue = dim?.values?.find((v: any) => v.id === valueId);
          rowData[dim?.id || ''] = labelAccessor(dimValue);
        });
        
        // Add observation values mapped by header key
        rowObs.forEach(obs => {
          const headerKey = headerDims.map(dim => obs[dim?.id || '']).join('_');
          
          // Extract observation metadata
          const cellData: SDMXCellData = {
            value: obs.value,
            flags: [],
            status: undefined,
            unit: obs.UNIT_MEASURE || obs.UNIT || '',
            decimals: obs.DECIMALS ? parseInt(obs.DECIMALS) : undefined,
            multiplier: obs.UNIT_MULT ? parseInt(obs.UNIT_MULT) : undefined
          };
          
          // Process observation flags
          if (obs.OBS_FLAG) {
            cellData.flags = [{ code: obs.OBS_FLAG, label: obs.OBS_FLAG }];
          }
          if (obs.FOOTNOTE) {
            cellData.footnote = obs.FOOTNOTE;
          }
          if (obs.OBS_STATUS) {
            cellData.status = obs.OBS_STATUS;
          }
          
          rowData.values[headerKey] = cellData;
        });
        
        dataRows.push(rowData);
      });
    }

    return { rowDims, headerDims, headerValues, dataRows, numRowColumns };
  }, [data, layout, labelAccessor]);

  // Calculate sticky positions for frozen columns
  useEffect(() => {
    if (!containerRef.current) return;

    const table = containerRef.current.querySelector('table');
    if (!table) return;

    const firstRow = table.querySelector('tbody tr');
    if (!firstRow) return;

    const cells = firstRow.querySelectorAll('td, th');
    const widths: number[] = [];
    cells.forEach((cell, idx) => {
      if (idx < freezeColumns) {
        widths[idx] = cell.getBoundingClientRect().width;
      }
    });
    setColumnWidths(widths);
  }, [tableData, freezeColumns]);

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading...</div>;
  }

  if (error) {
    return <div style={{ padding: '20px', color: 'red' }}>Error: {error}</div>;
  }

  if (!tableData) {
    return <div style={{ padding: '20px' }}>No data available</div>;
  }

  const { rowDims, headerDims, headerValues, dataRows, numRowColumns } = tableData;

  // Calculate left position for sticky columns
  const getStickyLeft = (index: number) => {
    if (index >= freezeColumns) return undefined;
    let left = 0;
    for (let i = 0; i < index && i < columnWidths.length; i++) {
      left += columnWidths[i];
    }
    return left;
  };

  return (
    <div 
      ref={containerRef}
      style={{ 
        width: '100%', 
        height: '70vh',
        overflow: 'auto',
        position: 'relative',
        border: '1px solid #d9d9d9'
      }}
    >
      <table style={{ 
        borderCollapse: 'separate',
        borderSpacing: 0,
        fontSize: '12px',
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        width: '100%',
        position: 'relative'
      }}>
        <thead style={{
          ...(freezeHeader ? {
            position: 'sticky',
            top: 0,
            zIndex: 10
          } : {})
        }}>
          {/* Generate hierarchical header rows for column dimensions */}
          {headerDims.map((dim, dimIndex) => {
            // Calculate colspan for each value at this level
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
            
            return (
              <tr key={`header_row_${dimIndex}`}>
                {/* Dimension name cell */}
                <th
                  colSpan={numRowColumns}
                  style={{
                    background: '#0050b3',
                    color: '#f5f5f5',
                    padding: '8px 12px',
                    textAlign: 'right',
                    verticalAlign: 'top',
                    fontWeight: 'bold',
                    fontStyle: 'italic',
                    borderRight: '1px solid #003a8c',
                    borderBottom: '1px solid #003a8c',
                    ...(freezeColumns > 0 ? {
                      position: 'sticky' as any,
                      left: 0,
                      zIndex: 11
                    } : {})
                  }}
                >
                  {dim?.name || ''}
                </th>
                
                {/* Dimension values */}
                {valuesToShow.map((value, idx) => (
                  <th
                    key={`header_${dimIndex}_${idx}`}
                    colSpan={value.colspan}
                    style={{
                      background: '#0050b3',
                      color: '#f5f5f5',
                      padding: '8px 12px',
                      textAlign: 'center',
                      verticalAlign: 'top',
                      fontWeight: 'normal',
                      borderRight: '1px solid #003a8c',
                      borderBottom: '1px solid #003a8c'
                    }}
                  >
                    {value.label}
                  </th>
                ))}
              </tr>
            );
          })}

          {/* Row dimension names header */}
          <tr>
            {rowDims.map((dim, idx) => (
              <th
                key={`row_dim_${idx}`}
                style={{
                  background: '#f0f0f0',
                  color: '#262626',
                  padding: '8px 12px',
                  textAlign: 'left',
                  verticalAlign: 'top',
                  fontWeight: 'bold',
                  fontStyle: 'italic',
                  borderRight: '1px solid #d9d9d9',
                  borderBottom: '1px solid #d9d9d9',
                  ...(idx < freezeColumns ? {
                    position: 'sticky' as any,
                    left: getStickyLeft(idx),
                    zIndex: 9
                  } : {})
                }}
              >
                {dim?.name || ''}
              </th>
            ))}
            
            {/* Unit column header */}
            <th style={{
              background: '#f0f0f0',
              color: '#262626',
              padding: '8px 12px',
              textAlign: 'center',
              verticalAlign: 'top',
              fontWeight: 'bold',
              fontStyle: 'italic',
              borderRight: '1px solid #d9d9d9',
              borderBottom: '1px solid #d9d9d9',
              width: '80px',
              ...(rowDims.length < freezeColumns ? {
                position: 'sticky' as any,
                left: getStickyLeft(rowDims.length),
                zIndex: 9
              } : {})
            }}>
              Unit
            </th>
            
            {/* Empty column for symbols */}
            <th style={{
              background: '#f0f0f0',
              color: '#262626',
              padding: '8px 12px',
              textAlign: 'center',
              verticalAlign: 'top',
              fontWeight: 'bold',
              fontStyle: 'italic',
              borderRight: '1px solid #d9d9d9',
              borderBottom: '1px solid #d9d9d9',
              width: '30px',
              ...(rowDims.length + 1 < freezeColumns ? {
                position: 'sticky' as any,
                left: getStickyLeft(rowDims.length + 1),
                zIndex: 9
              } : {})
            }}>
              
            </th>

            {/* Empty cells for column headers */}
            {headerValues.map((header, idx) => (
              <th
                key={`empty_${idx}`}
                style={{
                  background: '#f0f0f0',
                  borderRight: idx < headerValues.length - 1 ? '1px solid #d9d9d9' : 'none',
                  borderBottom: '1px solid #d9d9d9'
                }}
              >
                
              </th>
            ))}
          </tr>
        </thead>
        
        <tbody>
          {dataRows.map((row, rowIdx) => (
            <tr key={row.key}>
              {row.type === 'section' ? (
                <td
                  colSpan={numRowColumns + headerValues.length}
                  style={{
                    background: '#e6e6e6',
                    color: '#262626',
                    padding: '8px 12px',
                    textAlign: 'left',
                    verticalAlign: 'middle',
                    fontWeight: 'bold',
                    borderRight: '1px solid #d9d9d9',
                    borderBottom: '1px solid #d9d9d9'
                  }}
                >
                  {row.label}
                </td>
              ) : (
                <>
                  {/* Row dimension values */}
                  {rowDims.map((dim, idx) => (
                    <td
                      key={`row_${idx}`}
                      style={{
                        background: '#fafafa',
                        color: '#333',
                        padding: '6px 8px',
                        textAlign: 'left',
                        verticalAlign: 'top',
                        borderRight: '1px solid #f0f0f0',
                        borderBottom: '1px solid #f0f0f0',
                        ...(idx < freezeColumns ? {
                          position: 'sticky' as any,
                          left: getStickyLeft(idx),
                          zIndex: 1,
                          background: '#f5f5f5'
                        } : {})
                      }}
                    >
                      {row[dim?.id || '']}
                    </td>
                  ))}
                  
                  {/* Unit cell */}
                  <td
                    style={{
                      background: '#fafafa',
                      color: '#333',
                      padding: '6px 8px',
                      textAlign: 'center',
                      verticalAlign: 'top',
                      borderRight: '1px solid #f0f0f0',
                      borderBottom: '1px solid #f0f0f0',
                      ...(rowDims.length < freezeColumns ? {
                        position: 'sticky' as any,
                        left: getStickyLeft(rowDims.length),
                        zIndex: 1,
                        background: '#f5f5f5'
                      } : {})
                    }}
                  >
                    {row.values[headerValues[0]?.id]?.unit || ''}
                  </td>
                  
                  {/* Symbols cell */}
                  <td
                    style={{
                      background: '#fafafa',
                      color: '#333',
                      padding: '6px 8px',
                      textAlign: 'center',
                      verticalAlign: 'top',
                      borderRight: '1px solid #d9d9d9',
                      borderBottom: '1px solid #f0f0f0',
                      width: '30px',
                      ...(rowDims.length + 1 < freezeColumns ? {
                        position: 'sticky' as any,
                        left: getStickyLeft(rowDims.length + 1),
                        zIndex: 1,
                        background: '#f5f5f5'
                      } : {})
                    }}
                  >
                    
                  </td>

                  {/* Data cells */}
                  {headerValues.map((header, idx) => {
                    const cellData = row.values[header.id] || {};
                    
                    return (
                      <td
                        key={`cell_${idx}`}
                        style={{
                          background: '#ffffff',
                          color: '#333',
                          padding: '6px 8px',
                          textAlign: 'right',
                          verticalAlign: 'top',
                          borderRight: idx < headerValues.length - 1 ? '1px solid #f0f0f0' : 'none',
                          borderBottom: '1px solid #f0f0f0'
                        }}
                      >
                        <SDMXCell
                          {...cellData}
                          textAlign="right"
                        />
                      </td>
                    );
                  })}
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SDMXTableFreeze;
