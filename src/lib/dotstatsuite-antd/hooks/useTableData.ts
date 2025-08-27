/**
 * Custom hook for processing SDMX data into table format
 * Following react rule: Extract reusable logic into custom hooks
 */

import { useMemo } from 'react';
import { SDMXData, TableLayout } from '../types';
import { 
  TableData, 
  DataRow, 
  HeaderValue, 
  HeaderDimension,
  DisplayMode,
  LabelAccessor,
  HeaderCombination
} from '../types/table.types';
import { TABLE_SYMBOLS } from '../constants/table.constants';

/**
 * Creates label accessor based on display mode
 */
const createLabelAccessor = (display: DisplayMode): LabelAccessor => {
  return (item: any) => {
    if (!item) return '';
    
    switch (display) {
      case 'id':
        return item.id || '';
      case 'both':
        return item.name && item.id ? `${item.name} (${item.id})` : item.name || item.id || '';
      case 'name':
      default:
        return item.name || item.id || '';
    }
  };
};

/**
 * Processes header dimensions and calculates combinations
 */
const processHeaderDimensions = (
  data: SDMXData, 
  layout: TableLayout,
  labelAccessor: LabelAccessor
): { headerDims: HeaderDimension[], headerValues: HeaderValue[] } => {
  const headerDims = layout.header
    .map(id => data.dimensions.find(d => d.id === id))
    .filter(Boolean) as HeaderDimension[];

  const headerValues: HeaderValue[] = [];
  const headerCombinations = new Map<string, HeaderCombination>();

  if (headerDims.length > 0) {
    // Get all unique combinations of header dimension values
    data.observations.forEach(obs => {
      const headerKey = headerDims.map(dim => obs[dim?.id || '']).join('_');
      if (!headerCombinations.has(headerKey)) {
        const combination: HeaderCombination = {
          values: headerDims.map(dim => obs[dim?.id || '']),
          labels: headerDims.map(dim => {
            const valueId = obs[dim?.id || ''];
            const dimValue = dim?.values?.find((v: any) => v.id === valueId);
            return labelAccessor(dimValue);
          })
        };
        headerCombinations.set(headerKey, combination);
      }
    });

    // Sort and convert to array
    const sortedCombinations = Array.from(headerCombinations.entries())
      .sort(([a], [b]) => a.localeCompare(b));

    sortedCombinations.forEach(([key, combination]) => {
      headerValues.push({
        id: key,
        label: combination.labels.join(' / '),
        colspan: 1
      });
    });
  }

  return { headerDims, headerValues };
};

/**
 * Processes row dimensions
 */
const processRowDimensions = (
  data: SDMXData,
  layout: TableLayout
): HeaderDimension[] => {
  return layout.rows
    .map(id => data.dimensions.find(d => d.id === id))
    .filter(Boolean) as HeaderDimension[];
};

/**
 * Builds data rows with sections
 */
const buildDataRows = (
  data: SDMXData,
  layout: TableLayout,
  headerDims: HeaderDimension[],
  rowDims: HeaderDimension[],
  labelAccessor: LabelAccessor
): DataRow[] => {
  const dataRows: DataRow[] = [];

  if (layout.sections.length > 0) {
    // Group by sections
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
      // Add section header row
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
        sectionText: sectionTexts.join(TABLE_SYMBOLS.SECTION_SEPARATOR),
        values: {}
      });

      // Add data rows for this section
      const rowMap = new Map<string, DataRow>();
      observations.forEach(obs => {
        const rowKey = layout.rows.map(id => obs[id]).join('_');
        if (!rowMap.has(rowKey)) {
          const row: DataRow = {
            key: `${sectionKey}_${rowKey}`,
            isSection: false,
            unit: obs.UNIT || TABLE_SYMBOLS.UNIT_DEFAULT,
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
        
        // Add data values
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
    const rowMap = new Map<string, DataRow>();
    
    data.observations.forEach(obs => {
      const rowKey = layout.rows.map(id => obs[id]).join('_');
      if (!rowMap.has(rowKey)) {
        const row: DataRow = {
          key: rowKey,
          isSection: false,
          unit: obs.UNIT || TABLE_SYMBOLS.UNIT_DEFAULT,
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
      
      // Add data values
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

  return dataRows;
};

/**
 * Main hook to process SDMX data into table format
 */
export const useTableData = (
  data: SDMXData,
  layout: TableLayout,
  display: DisplayMode = 'name'
): TableData | null => {
  return useMemo(() => {
    if (!data || !layout) return null;

    try {
      const labelAccessor = createLabelAccessor(display);
      const rowDims = processRowDimensions(data, layout);
      const { headerDims, headerValues } = processHeaderDimensions(data, layout, labelAccessor);
      const dataRows = buildDataRows(data, layout, headerDims, rowDims, labelAccessor);
      
      // Calculate number of row columns (dimensions + unit + symbols)
      const numRowColumns = rowDims.length + 2;

      return {
        rowDims,
        headerDims,
        headerValues,
        dataRows,
        numRowColumns
      };
    } catch (error) {
      console.error('Error processing table data:', error);
      return null;
    }
  }, [data, layout, display]);
};
