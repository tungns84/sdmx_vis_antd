import * as R from 'ramda';
import {
  SDMXObservation,
  SDMXDimension,
  TableCell,
} from '../types';
import { 
  getObservationKey,
  hasObservationValue,
  formatObservationValue,
  indexObservations,
} from '../utils/index';

interface ParsedLayout {
  header: any[];
  sections: any[];
  rows: any[];
}

// Create cell from observation
const createCell = (
  observation: SDMXObservation,
  customAttributes: string[]
): TableCell => {
  const cell: TableCell = {
    value: observation.value,
    attributes: {},
    flags: [],
    notes: [],
  };

  // Add custom attributes
  customAttributes.forEach(attrId => {
    if (observation[attrId] !== undefined) {
      cell.attributes![attrId] = observation[attrId];
    }
  });

  // Add metadata
  if (observation.metadata) {
    cell.metadata = observation.metadata;
  }

  // Add flags and notes
  if (observation.OBS_STATUS) {
    cell.flags!.push(observation.OBS_STATUS);
  }
  
  if (observation.OBS_NOTE) {
    cell.notes!.push(observation.OBS_NOTE);
  }

  return cell;
};

// Get dimension IDs from layout entry
const getDimensionIds = (entry: any): string[] => {
  if (entry.id) {
    return [entry.id];
  }
  
  if (entry.dimensions) {
    return entry.dimensions.map((d: any) => d.id);
  }
  
  return [];
};

// Build cell key from coordinates
const buildCellKey = (
  rowKey: string,
  sectionKey: string,
  headerKey: string
): string => {
  return `${rowKey}:${sectionKey}:${headerKey}`;
};

// Main function to get cells
export const getCells = (
  observations: SDMXObservation[],
  layout: ParsedLayout,
  dimensions: SDMXDimension[],
  customAttributes: string[] = []
): Record<string, Record<string, Record<string, TableCell[]>>> => {
  const cells: Record<string, Record<string, Record<string, TableCell[]>>> = {};

  // Get dimension IDs for each layout level
  const headerDimIds = layout.header.flatMap(getDimensionIds);
  const sectionDimIds = layout.sections.flatMap(getDimensionIds);
  const rowDimIds = layout.rows.flatMap(getDimensionIds);

  // Index observations by different keys
  const indexedByRow = indexObservations(
    observations,
    (obs: SDMXObservation) => getObservationKey(obs, rowDimIds)
  );

  const indexedBySection = indexObservations(
    observations,
    (obs: SDMXObservation) => getObservationKey(obs, sectionDimIds)
  );

  const indexedByHeader = indexObservations(
    observations,
    (obs: SDMXObservation) => getObservationKey(obs, headerDimIds)
  );

  // Process observations and build cells structure
  observations.forEach(obs => {
    const rowKey = getObservationKey(obs, rowDimIds) || '';
    const sectionKey = getObservationKey(obs, sectionDimIds) || '';
    const headerKey = getObservationKey(obs, headerDimIds) || '';

    // Initialize structure if needed
    if (!cells[rowKey]) {
      cells[rowKey] = {};
    }
    if (!cells[rowKey][sectionKey]) {
      cells[rowKey][sectionKey] = {};
    }
    if (!cells[rowKey][sectionKey][headerKey]) {
      cells[rowKey][sectionKey][headerKey] = [];
    }

    // Create and add cell
    const cell = createCell(obs, customAttributes);
    cells[rowKey][sectionKey][headerKey].push(cell);
  });

  // Handle empty cells for complete grid
  const allRowKeys = Object.keys(indexedByRow);
  const allSectionKeys = Object.keys(indexedBySection);
  const allHeaderKeys = Object.keys(indexedByHeader);

  allRowKeys.forEach(rowKey => {
    if (!cells[rowKey]) {
      cells[rowKey] = {};
    }
    
    allSectionKeys.forEach(sectionKey => {
      if (!cells[rowKey][sectionKey]) {
        cells[rowKey][sectionKey] = {};
      }
      
      allHeaderKeys.forEach(headerKey => {
        if (!cells[rowKey][sectionKey][headerKey]) {
          // Create empty cell
          cells[rowKey][sectionKey][headerKey] = [{
            value: null,
            isEmpty: true,
          }];
        }
      });
    });
  });

  return cells;
};
