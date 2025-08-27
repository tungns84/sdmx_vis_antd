import React, { useMemo, useCallback, useRef, useEffect, useState, Fragment } from 'react';
import { SDMXData, TableLayout } from '../../types';
import SDMXCell, { SDMXCellData, ObservationFlag } from './SDMXCell';
import './tableStyles.css';

interface SDMXTableProps {
  data: SDMXData;
  layout: TableLayout;
  loading?: boolean;
  error?: string;
  display?: 'id' | 'name' | 'both';
}

const SDMXTableAutoFreeze: React.FC<SDMXTableProps> = ({
  data,
  layout,
  loading = false,
  error,
  display = 'name',
}) => {
  const tableRef = useRef<HTMLTableElement>(null);
  const headerRef = useRef<HTMLTableSectionElement>(null);
  const [columnWidths, setColumnWidths] = useState<number[]>([]);
  const [headerHeight, setHeaderHeight] = useState<number>(0);
  
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

    // Build all unique header combinations from actual data
    const headerCombinations: string[] = [];
    const headerValueMap = new Map<string, any>();
    
    if (headerDims.length > 0) {
      const uniqueKeys = new Set<string>();
      
      data.observations.forEach(obs => {
        const key = headerDims.map(dim => obs[dim?.id || '']).join('_');
        if (!uniqueKeys.has(key)) {
          uniqueKeys.add(key);
          const values: any = {};
          headerDims.forEach(dim => {
            const valueId = obs[dim?.id || ''];
            const dimValue = dim?.values?.find((v: any) => v.id === valueId);
            values[dim.id] = {
              id: valueId,
              label: labelAccessor(dimValue)
            };
          });
          headerValueMap.set(key, values);
        }
      });
      
      // Sort header combinations for consistent ordering
      headerCombinations.push(...Array.from(uniqueKeys).sort());
    }

    // Build data rows
    const dataRows: any[] = [];
    
    if (layout.sections.length > 0) {
      // Get section dimensions
      const sectionDims = layout.sections.map(id => 
        data.dimensions.find(d => d.id === id)
      ).filter(Boolean);

      // Group observations by sections
      const sectionGroups = new Map<string, any[]>();
      
      data.observations.forEach(obs => {
        const sectionKey = layout.sections.map(id => obs[id]).join('_');
        if (!sectionGroups.has(sectionKey)) {
          sectionGroups.set(sectionKey, []);
        }
        sectionGroups.get(sectionKey)!.push(obs);
      });
      
      // Process each section
      sectionGroups.forEach((observations, sectionKey) => {
        // Build section header labels (multi-dimensional)
        const sectionLabels: string[] = [];
        
        sectionDims.forEach((dim) => {
          const valueId = observations[0][dim?.id || ''];
          const dimValue = dim?.values?.find((v: any) => v.id === valueId);
          const dimName = labelAccessor(dim);
          const valueName = labelAccessor(dimValue);
          sectionLabels.push(`${dimName}:${valueName}`);
        });
        
        // Add section header
        dataRows.push({
          type: 'section',
          key: sectionKey,
          labels: sectionLabels  // Array of labels for multi-dimensional sections
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
        
        // Create data rows for this section
        rowGroups.forEach((rowObs, rowKey) => {
          const rowData: any = {
            type: 'data',
            key: `${sectionKey}_${rowKey}`,
            // Store row dimension values as array for proper sticky positioning
            rowDimValues: [],
            values: {}
          };
          
          // Add row dimension values as array
          rowDims.forEach(dim => {
            const valueId = rowObs[0][dim?.id || ''];
            const dimValue = dim?.values?.find((v: any) => v.id === valueId);
            rowData.rowDimValues.push(labelAccessor(dimValue));
          });
          
          // Extract unit from first observation
          const unitDim = data.dimensions.find(d => d.id === 'UNIT');
          if (unitDim && rowObs[0].UNIT) {
            const unitValue = unitDim.values?.find((v: any) => v.id === rowObs[0].UNIT);
            rowData.unit = labelAccessor(unitValue);
          }
          
          // Add observation values for each header combination
          headerCombinations.forEach(headerKey => {
            const obs = rowObs.find(o => 
              headerDims.map(dim => o[dim?.id || '']).join('_') === headerKey
            );
            
            if (obs) {
              const cellData: SDMXCellData = {
                value: obs.value,
                flags: [],
                status: undefined,
                unit: rowData.unit || '',
                decimals: obs.DECIMALS ? parseInt(obs.DECIMALS) : undefined,
                multiplier: obs.UNIT_MULT ? parseInt(obs.UNIT_MULT) : undefined
              };
              
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
            }
          });
          
          dataRows.push(rowData);
        });
      });
    } else {
      // No sections - group all observations by row dimensions
      const rowGroups = new Map<string, any[]>();
      
      data.observations.forEach(obs => {
        const rowKey = rowDims.map(dim => obs[dim?.id || '']).join('_');
        if (!rowGroups.has(rowKey)) {
          rowGroups.set(rowKey, []);
        }
        rowGroups.get(rowKey)!.push(obs);
      });
      
      // Create data rows
      rowGroups.forEach((rowObs, rowKey) => {
        const rowData: any = {
          type: 'data',
          key: rowKey,
          // Store row dimension values as array for proper sticky positioning
          rowDimValues: [],
          values: {}
        };
        
        // Add row dimension values as array
        rowDims.forEach(dim => {
          const valueId = rowObs[0][dim?.id || ''];
          const dimValue = dim?.values?.find((v: any) => v.id === valueId);
          rowData.rowDimValues.push(labelAccessor(dimValue));
        });
        
        // Extract unit from first observation
        const unitDim = data.dimensions.find(d => d.id === 'UNIT');
        if (unitDim && rowObs[0].UNIT) {
          const unitValue = unitDim.values?.find((v: any) => v.id === rowObs[0].UNIT);
          rowData.unit = labelAccessor(unitValue);
        }
        
        // Add observation values for each header combination
        headerCombinations.forEach(headerKey => {
          const obs = rowObs.find(o => 
            headerDims.map(dim => o[dim?.id || '']).join('_') === headerKey
          );
          
          if (obs) {
            const cellData: SDMXCellData = {
              value: obs.value,
              flags: [],
              status: undefined,
              unit: rowData.unit || '',
              decimals: obs.DECIMALS ? parseInt(obs.DECIMALS) : undefined,
              multiplier: obs.UNIT_MULT ? parseInt(obs.UNIT_MULT) : undefined
            };
            
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
          }
        });
        
        dataRows.push(rowData);
      });
    }

    return { 
      rowDims, 
      headerDims, 
      headerCombinations, 
      headerValueMap,
      dataRows, 
      numRowColumns 
    };
  }, [data, layout, labelAccessor]);

  // Calculate column widths for sticky positioning
  useEffect(() => {
    if (!tableRef.current || !tableData) return;

    const calculateWidths = () => {
      const table = tableRef.current;
      if (!table) return;

      // Get the last header row which contains the row dimension headers
      const headerRow = table.querySelector('thead tr:last-child');
      if (!headerRow) return;

      const cells = headerRow.querySelectorAll('th');
      const widths: number[] = [];
      
      // Calculate cumulative widths for sticky positioning
      let cumulativeWidth = 0;
      for (let i = 0; i < tableData.numRowColumns; i++) {
        widths[i] = cumulativeWidth;
        if (cells[i]) {
          cumulativeWidth += cells[i].getBoundingClientRect().width;
        }
      }
      
      setColumnWidths(widths);
    };

    // Calculate initially with a small delay to ensure table is rendered
    setTimeout(calculateWidths, 0);

    // Recalculate on resize
    const resizeObserver = new ResizeObserver(() => {
      calculateWidths();
    });

    resizeObserver.observe(tableRef.current);
    
    return () => {
      resizeObserver.disconnect();
    };
  }, [tableData]);

  // Calculate header height for section sticky positioning
  useEffect(() => {
    if (!headerRef.current) return;
    
    const calculateHeaderHeight = () => {
      if (headerRef.current) {
        const height = headerRef.current.clientHeight;
        setHeaderHeight(height);
      }
    };
    
    // Calculate initially with a small delay to ensure rendering
    setTimeout(calculateHeaderHeight, 10);
    
    const resizeObserver = new ResizeObserver(() => {
      calculateHeaderHeight();
    });

    resizeObserver.observe(headerRef.current);
    
    return () => {
      resizeObserver.disconnect();
    };
  }, [tableData]); // Recalculate when tableData changes

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading...</div>;
  }

  if (error) {
    return <div style={{ padding: '20px', color: 'red' }}>Error: {error}</div>;
  }

  if (!tableData) {
    return <div style={{ padding: '20px' }}>No data available</div>;
  }

  const { rowDims, headerDims, headerCombinations, headerValueMap, dataRows, numRowColumns } = tableData;

  // Generate header rows for multi-dimensional headers
  const renderHeaderRows = () => {
    const rows: JSX.Element[] = [];
    
    if (headerDims.length === 0) {
      return rows;
    }
    
    // For each header dimension, create a row
    headerDims.forEach((dim, dimIndex) => {
      const cells: JSX.Element[] = [];
      
      // First cell: dimension name (spans all row columns)
      cells.push(
        <th
          key={`dim_name_${dimIndex}`}
          colSpan={numRowColumns}
          className="column-dim-name"
          style={{
            position: 'sticky',
            left: 0,
            zIndex: 11
          }}
        >
          {dim?.name || ''}
        </th>
      );
      
      // For the first dimension, show each unique value with appropriate colspan
      if (dimIndex === 0 && headerDims.length > 1) {
        // Group header combinations by first dimension value
        const firstDimGroups = new Map<string, number>();
        headerCombinations.forEach(key => {
          const values = headerValueMap.get(key);
          const firstDimValue = values[dim.id].id;
          firstDimGroups.set(firstDimValue, (firstDimGroups.get(firstDimValue) || 0) + 1);
        });
        
        // Render cells with colspan
        Array.from(firstDimGroups.entries()).forEach(([valueId, colspan], idx) => {
          const dimValue = dim?.values?.find((v: any) => v.id === valueId);
          cells.push(
            <th
              key={`dim_${dimIndex}_val_${idx}`}
              colSpan={colspan}
              className="column-dim-value"
              style={{
                position: 'sticky',
                top: 0,
                zIndex: 10
              }}
            >
              {labelAccessor(dimValue)}
            </th>
          );
        });
      } else {
        // For other dimensions or single dimension, show all values
        headerCombinations.forEach((key, idx) => {
          const values = headerValueMap.get(key);
          const value = values[dim.id];
          cells.push(
            <th
              key={`dim_${dimIndex}_val_${idx}`}
              className="column-dim-value"
              style={{
                position: 'sticky',
                top: 0,
                zIndex: 10
              }}
            >
              {value.label}
            </th>
          );
        });
      }
      
      rows.push(
        <tr key={`header_row_${dimIndex}`}>
          {cells}
        </tr>
      );
    });
    
    return rows;
  };

  return (
    <div className="sdmx-table-container">
      <table 
        ref={tableRef}
        className="sdmx-table"
      >
        <thead ref={headerRef} className="sdmx-thead">
          {/* Header dimension rows */}
          {renderHeaderRows()}
          
          {/* Row dimension names */}
          <tr>
            {rowDims.map((dim, idx) => (
              <th
                key={`row_dim_${idx}`}
                className="row-dim-name"
                style={{
                  position: 'sticky',
                  left: columnWidths[idx] !== undefined ? columnWidths[idx] : idx * 100,
                  top: 0,
                  zIndex: 11
                }}
              >
                {dim?.name || ''}
              </th>
            ))}
            
            {/* Unit column header */}
            <th 
              className="row-dim-name"
              style={{
                textAlign: 'center',
                position: 'sticky',
                left: columnWidths[rowDims.length] !== undefined ? columnWidths[rowDims.length] : rowDims.length * 100,
                top: headerDims.length * 25,
                zIndex: 11
              }}>
              Unit
            </th>
            
            {/* Symbols column header */}
            <th 
              className="row-dim-value-blank"
              style={{
                position: 'sticky',
                left: columnWidths[rowDims.length + 1] !== undefined ? columnWidths[rowDims.length + 1] : (rowDims.length * 100 + 50),
                top: headerDims.length * 25,
                zIndex: 11,
                borderRight: '2px solid #999'
              }}>
              
            </th>

            {/* Empty cells for data columns */}
            {headerCombinations.map((_, idx) => (
              <th
                key={`empty_${idx}`}
                className="row-dim-name"
                style={{
                  position: 'sticky',
                  top: 0,
                  zIndex: 10
                }}
              >
                
              </th>
            ))}
          </tr>
        </thead>
        
        <tbody>
          {dataRows.map((row, rowIndex) => {
            if (row.type === 'section') {
              // Material-UI TableRow có thể render khác, nhưng trong HTML thuần
              // position:sticky chỉ hoạt động trên th/td, không phải tr
              return (
                <tr key={row.key}>
                  <th
                    colSpan={numRowColumns + headerCombinations.length}
                    scope="col"
                    className="section-header"
                                      style={{
                    position: 'sticky',
                    left: 0,
                    top: headerHeight || 0,
                    zIndex: 2
                  }}
                  >
                    {/* Port từ code cũ: Grid container > Grid item với sticky */}
                    <div style={{ 
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <div style={{
                        position: 'sticky',
                        left: '8px',
                        padding: '4px 0'
                      }}>
                        {row.labels.map((label: string, idx: number) => {
                          const colonIndex = label.indexOf(':');
                          const dimName = colonIndex !== -1 ? label.substring(0, colonIndex) : label;
                          const valueName = colonIndex !== -1 ? label.substring(colonIndex + 1) : '';
                          
                          return (
                            <Fragment key={idx}>
                              {idx !== 0 && <br />}
                                                          <span className="dimension-name">
                              {dimName}:
                            </span>
                            <span className="dimension-value">
                              {valueName}
                            </span>
                            </Fragment>
                          );
                        })}
                      </div>
                    </div>
                  </th>
                </tr>
              );
            }
            
            // Data row with individually sticky row dimension cells
            return (
              <tr key={row.key}>
                {/* Row dimension value cells - each with individual sticky positioning */}
                {row.rowDimValues.map((value: string, idx: number) => (
                  <td
                    key={`row_dim_${idx}`}
                    className="row-dim-value"
                                      style={{
                    position: 'sticky',
                    left: columnWidths[idx] !== undefined ? columnWidths[idx] : idx * 100,
                    zIndex: 1,
                    boxShadow: idx === rowDims.length - 1 ? '1px 0 2px rgba(0,0,0,0.1)' : 'none'
                  }}
                  >
                    {value}
                  </td>
                ))}
                
                {/* Unit cell */}
                <td
                  className="unit-cell"
                  style={{
                    position: 'sticky',
                    left: columnWidths[rowDims.length] !== undefined ? columnWidths[rowDims.length] : rowDims.length * 100,
                    zIndex: 1
                  }}
                >
                  {row.unit || ''}
                </td>
                
                {/* Symbols cell */}
                <td
                  className="symbols-cell"
                  style={{
                    position: 'sticky',
                    left: columnWidths[rowDims.length + 1] !== undefined ? columnWidths[rowDims.length + 1] : (rowDims.length * 100 + 50),
                    zIndex: 1,
                    boxShadow: '2px 0 4px rgba(0,0,0,0.15)'
                  }}
                >
                  
                </td>

                {/* Data cells */}
                {headerCombinations.map((headerKey, idx) => {
                  const cellData = row.values[headerKey] || {};
                  
                  return (
                    <td
                      key={`cell_${idx}`}
                      className="data-cell"
                    >
                      <SDMXCell
                        {...cellData}
                        textAlign="right"
                      />
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SDMXTableAutoFreeze;