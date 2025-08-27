import * as R from 'ramda';
import {
  SDMXObservation,
  SDMXDimension,
  SDMXDimensionValue,
  TableHeaderData,
  TableSectionData,
  TableCell,
} from '../types';
import {
  getDimensionById,
  getDimensionValueById,
  sortDimensionValues,
} from '../utils/index';

interface ParsedLayout {
  header: any[];
  sections: any[];
  rows: any[];
}

interface LayoutDataResult {
  headerData: TableHeaderData[];
  sectionsData: TableSectionData[];
  totalCells: number;
  truncated: boolean;
}

// Build header cell
const buildHeaderCell = (
  value: SDMXDimensionValue | undefined,
  dimension: SDMXDimension
): TableCell => {
  return {
    value: value || { id: '', name: '' },
    isHeader: true,
    metadata: {
      dimensionId: dimension.id,
      dimensionName: dimension.name,
    },
  };
};

// Build section cell
const buildSectionCell = (
  value: SDMXDimensionValue | undefined,
  dimension: SDMXDimension
): TableCell => {
  return {
    value: value || { id: '', name: '' },
    isHeader: true,
    metadata: {
      dimensionId: dimension.id,
      dimensionName: dimension.name,
    },
  };
};

// Get unique values for dimension from observations
const getUniqueValuesFromObs = (
  observations: SDMXObservation[],
  dimensionId: string
): string[] => {
  const values = observations
    .map(obs => obs[dimensionId])
    .filter(Boolean);
  
  return [...new Set(values)];
};

// Build header data
const buildHeaderData = (
  headerLayout: any[],
  observations: SDMXObservation[],
  dimensions: SDMXDimension[]
): TableHeaderData[] => {
  const headerData: TableHeaderData[] = [];
  
  headerLayout.forEach((entry, level) => {
    const levelData: TableCell[] = [];
    
    if (entry.id) {
      // Single dimension
      const dimension = getDimensionById(dimensions, entry.id);
      if (dimension) {
        const uniqueValues = getUniqueValuesFromObs(observations, dimension.id);
        const sortedValues = sortDimensionValues(dimension.values, dimension.isInverted);
        
        sortedValues.forEach(value => {
          if (uniqueValues.includes(value.id)) {
            levelData.push(buildHeaderCell(value, dimension));
          }
        });
      }
    } else if (entry.dimensions) {
      // Combination of dimensions
      entry.dimensions.forEach((dim: SDMXDimension) => {
        const uniqueValues = getUniqueValuesFromObs(observations, dim.id);
        const sortedValues = sortDimensionValues(dim.values, dim.isInverted);
        
        sortedValues.forEach(value => {
          if (uniqueValues.includes(value.id)) {
            levelData.push(buildHeaderCell(value, dim));
          }
        });
      });
    }
    
    if (levelData.length > 0) {
      headerData.push({
        level,
        data: levelData,
      });
    }
  });
  
  return headerData;
};

// Build sections data
const buildSectionsData = (
  sectionsLayout: any[],
  rowsLayout: any[],
  observations: SDMXObservation[],
  dimensions: SDMXDimension[]
): TableSectionData[] => {
  const sectionsData: TableSectionData[] = [];
  
  // Process sections
  sectionsLayout.forEach(entry => {
    if (entry.id) {
      const dimension = getDimensionById(dimensions, entry.id);
      if (dimension) {
        const uniqueValues = getUniqueValuesFromObs(observations, dimension.id);
        const sortedValues = sortDimensionValues(dimension.values, dimension.isInverted);
        
        sortedValues.forEach(value => {
          if (uniqueValues.includes(value.id)) {
            const sectionData: TableCell[][] = [];
            
            // Add rows for this section
            rowsLayout.forEach(rowEntry => {
              const rowData: TableCell[] = [];
              
              if (rowEntry.id) {
                const rowDim = getDimensionById(dimensions, rowEntry.id);
                if (rowDim) {
                  const rowUniqueValues = getUniqueValuesFromObs(observations, rowDim.id);
                  const rowSortedValues = sortDimensionValues(rowDim.values, rowDim.isInverted);
                  
                  rowSortedValues.forEach(rowValue => {
                    if (rowUniqueValues.includes(rowValue.id)) {
                      rowData.push(buildSectionCell(rowValue, rowDim));
                    }
                  });
                }
              }
              
              if (rowData.length > 0) {
                sectionData.push(rowData);
              }
            });
            
            sectionsData.push({
              id: value.id,
              title: value.name,
              data: sectionData,
            });
          }
        });
      }
    }
  });
  
  // If no sections, create default section with rows
  if (sectionsData.length === 0 && rowsLayout.length > 0) {
    const defaultSectionData: TableCell[][] = [];
    
    rowsLayout.forEach(rowEntry => {
      const rowData: TableCell[] = [];
      
      if (rowEntry.id) {
        const rowDim = getDimensionById(dimensions, rowEntry.id);
        if (rowDim) {
          const rowUniqueValues = getUniqueValuesFromObs(observations, rowDim.id);
          const rowSortedValues = sortDimensionValues(rowDim.values, rowDim.isInverted);
          
          rowSortedValues.forEach(rowValue => {
            if (rowUniqueValues.includes(rowValue.id)) {
              rowData.push(buildSectionCell(rowValue, rowDim));
            }
          });
        }
      }
      
      if (rowData.length > 0) {
        defaultSectionData.push(rowData);
      }
    });
    
    sectionsData.push({
      id: 'default',
      title: '',
      data: defaultSectionData,
    });
  }
  
  return sectionsData;
};

// Main function to get layout data
export const getLayoutData = (
  layout: ParsedLayout,
  observations: SDMXObservation[],
  dimensions: SDMXDimension[],
  limit: number = 1000000
): LayoutDataResult => {
  // Build header and sections data
  const headerData = buildHeaderData(layout.header, observations, dimensions);
  const sectionsData = buildSectionsData(layout.sections, layout.rows, observations, dimensions);
  
  // Calculate total cells
  let totalCells = 0;
  headerData.forEach(level => {
    totalCells += level.data.length;
  });
  sectionsData.forEach(section => {
    section.data.forEach(row => {
      totalCells += row.length;
    });
  });
  
  // Check if truncated
  const truncated = observations.length > limit;
  
  return {
    headerData,
    sectionsData,
    totalCells,
    truncated,
  };
};
