import React, { useMemo, useCallback } from 'react';
import { SDMXData, TableLayout } from '../../types';
import SDMXCell, { SDMXCellData, ObservationFlag } from './SDMXCell';

interface SDMXTableProps {
  data: SDMXData;
  layout: TableLayout;
  loading?: boolean;
  error?: string;
  display?: 'id' | 'name' | 'both';
}

const SDMXTableHTML: React.FC<SDMXTableProps> = ({
  data,
  layout,
  loading = false,
  error,
  display = 'name',
}) => {
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
        // Section header row
        const sectionTexts: string[] = [];
        layout.sections.forEach(dimId => {
          const dim = data.dimensions.find(d => d.id === dimId);
          const value = observations[0][dimId];
          const dimValue = dim?.values.find(v => v.id === value);
          sectionTexts.push(`${dim?.name}: ${labelAccessor(dimValue)}`);
        });
        
        dataRows.push({
          key: `section_${sectionKey}`,
          isSection: true,
          sectionText: sectionTexts.join(' • '),
        });
        
        // Data rows for this section
        const rowMap = new Map<string, any>();
        observations.forEach(obs => {
          const rowKey = layout.rows.map(id => obs[id]).join('_');
          if (!rowMap.has(rowKey)) {
            const row: any = {
              key: `${sectionKey}_${rowKey}`,
              isSection: false,
              unit: obs.UNIT || 'Euro, Millions',
              values: {}
            };
            
            // Add row dimension values
            layout.rows.forEach(dimId => {
              const dim = data.dimensions.find(d => d.id === dimId);
              const dimValue = dim?.values?.find((v: any) => v.id === obs[dimId]);
              row[`row_${dimId}`] = labelAccessor(dimValue);
            });
            
            rowMap.set(rowKey, row);
          }
          
          // Add data values - use combined header key
          if (headerDims.length > 0) {
            const headerKey = headerDims.map(dim => obs[dim?.id || '']).join('_');
            const rowData = rowMap.get(rowKey);
            if (rowData) {
              rowData.values[headerKey] = obs.value;
            }
          }
        });
        
        dataRows.push(...Array.from(rowMap.values()));
      });
    } else {
      // No sections - process all observations as regular rows
      const rowMap = new Map<string, any>();
      
      data.observations.forEach(obs => {
        const rowKey = layout.rows.map(id => obs[id]).join('_');
        if (!rowMap.has(rowKey)) {
          const row: any = {
            key: rowKey,
            isSection: false,
            unit: obs.UNIT || 'Euro, Millions',
            values: {}
          };
          
          // Add row dimension values
          layout.rows.forEach(dimId => {
            const dim = data.dimensions.find(d => d.id === dimId);
            const dimValue = dim?.values?.find((v: any) => v.id === obs[dimId]);
            row[`row_${dimId}`] = labelAccessor(dimValue);
          });
          
          rowMap.set(rowKey, row);
        }
        
        // Add data values - use combined header key
        if (headerDims.length > 0) {
          const headerKey = headerDims.map(dim => obs[dim?.id || '']).join('_');
          const rowData = rowMap.get(rowKey);
          if (rowData) {
            rowData.values[headerKey] = obs.value;
          }
        }
      });
      
      dataRows.push(...Array.from(rowMap.values()));
    }

    return {
      rowDims,
      headerDims,
      headerValues,
      dataRows,
      numRowColumns
    };
  }, [data, layout, labelAccessor]);

  if (error) {
    return <div style={{ padding: '20px', color: '#ff4d4f' }}>Error: {error}</div>;
  }

  if (!tableData) {
    return <div style={{ padding: '20px' }}>No data available</div>;
  }

  const { rowDims, headerDims, headerValues, dataRows, numRowColumns } = tableData;

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <table style={{ 
        borderCollapse: 'separate',
        borderSpacing: 0,
        border: '1px solid #d9d9d9',
        fontSize: '12px',
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        width: '100%'
      }}>
        <thead>
          {/* Create one row for each column dimension */}
          {headerDims.map((dim, dimIndex) => {
            // Calculate how many columns each value should span
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
                    borderBottom: '1px solid #003a8c'
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
                      padding: '8px',
                      textAlign: 'center',
                      verticalAlign: 'top',
                      fontWeight: 'normal',
                      borderRight: idx < valuesToShow.length - 1 ? '1px solid #003a8c' : 'none',
                      borderBottom: '1px solid #003a8c'
                    }}
                  >
                    {value.label}
                  </th>
                ))}
              </tr>
            );
          })}
          
          {/* Row heading dimension names row */}
          <tr>
            {/* Row dimension headers */}
            {rowDims.map((dim, idx) => (
              <th
                key={`row_header_${idx}`}
                style={{
                  background: '#f5f5f5',
                  color: '#333',
                  padding: '8px',
                  textAlign: 'left',  // Top-Left alignment
                  verticalAlign: 'top',
                  fontWeight: 'bold',
                  fontStyle: 'italic',
                  borderRight: '1px solid #d9d9d9',
                  borderBottom: '1px solid #d9d9d9'
                }}
              >
                {dim?.name || ''}
              </th>
            ))}
            
            {/* Unit header */}
            <th style={{
              background: '#f5f5f5',
              color: '#333',
              padding: '8px',
              textAlign: 'center',  // Top-Center alignment
              verticalAlign: 'top',
              borderRight: '1px solid #d9d9d9',
              borderBottom: '1px solid #d9d9d9'
            }}>
              Unit
            </th>
            
            {/* Symbols header */}
            <th style={{
              background: '#f5f5f5',
              width: '40px',
              verticalAlign: 'top',
              borderRight: '1px solid #d9d9d9',
              borderBottom: '1px solid #d9d9d9'
            }}>
            </th>
            
            {/* Empty cells under the data columns */}
            {headerValues.map((_, idx) => (
              <th
                key={`empty_${idx}`}
                style={{
                  background: '#f5f5f5',
                  verticalAlign: 'top',
                  borderRight: idx < headerValues.length - 1 ? '1px solid #d9d9d9' : 'none',
                  borderBottom: '1px solid #d9d9d9'
                }}
              >
              </th>
            ))}
          </tr>
        </thead>
        
        <tbody>
          {dataRows.map((row) => (
            <tr key={row.key}>
              {row.isSection ? (
                <td
                  colSpan={numRowColumns + headerValues.length}
                  style={{
                    background: '#d4e8fc',
                    padding: '8px',
                    fontWeight: 'bold',
                    fontStyle: 'italic',
                    textAlign: 'left',  // Top-Left alignment for section
                    verticalAlign: 'top',
                    borderBottom: '1px solid #69c0ff'
                  }}
                >
                  {row.sectionText}
                </td>
              ) : (
                <>
                  {/* Row dimension values */}
                  {rowDims.map((dim, idx) => (
                    <td
                      key={`row_${idx}`}
                      style={{
                        background: '#f5f5f5',
                        color: '#333',
                        padding: '6px 8px',
                        textAlign: 'left',  // Top-Left alignment
                        verticalAlign: 'top',
                        borderRight: '1px solid #d9d9d9',
                        borderBottom: '1px solid #f0f0f0'
                      }}
                    >
                      {row[`row_${dim?.id}`] || ''}
                    </td>
                  ))}
                  
                  {/* Unit cell */}
                  <td style={{
                    background: '#f5f5f5',
                    color: '#333',
                    padding: '6px 8px',
                    textAlign: 'center',  // Top-Center alignment
                    verticalAlign: 'top',
                    borderRight: '1px solid #d9d9d9',
                    borderBottom: '1px solid #f0f0f0'
                  }}>
                    {row.unit}
                  </td>
                  
                  {/* Symbol cell */}
                  <td style={{
                    background: 'white',
                    padding: '6px',
                    textAlign: 'center',  // Top-Center alignment
                    verticalAlign: 'top',
                    borderRight: '1px solid #d9d9d9',
                    borderBottom: '1px solid #f0f0f0'
                  }}>
                    ●
                  </td>
                  
                  {/* Data cells */}
                  {headerValues.map((header, idx) => {
                    const value = row.values[header.id];
                    
                    // Generate SDMX metadata for demonstration
                    // In real implementation, this would come from observation attributes
                    const cellData: SDMXCellData = {
                      value: value,
                      // Add sample flags for some cells
                      flags: idx % 5 === 0 && value ? [
                        { code: 'p', label: 'Provisional' }
                      ] : idx % 7 === 0 && value ? [
                        { code: 'e', label: 'Estimated' },
                        { label: 'See note 1', type: 'uncoded' }
                      ] : undefined,
                      // Add sample status for some cells
                      status: idx % 11 === 0 && value ? 'P' : 
                              idx % 13 === 0 && value ? 'E' : undefined,
                      decimals: 1,
                      unit: row.unit || undefined
                    };
                      
                    return (
                      <td
                        key={`data_${idx}`}
                        style={{
                          background: 'white',
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

export default SDMXTableHTML;
