import * as R from 'ramda';
import {
  SDMXData,
  SDMXDimension,
  SDMXObservation,
  SDMXAttribute,
  TableLayout,
  TableProps,
  TableCell,
  TableHeaderData,
  TableSectionData,
} from '../types';
import { getLayout } from './getLayout';
import { getCells } from './getCells';
import { getLayoutData } from './getLayoutData';
import { 
  getOneValueDimensions,
  getManyValueDimensions,
  indexObservations,
  getObservationKey,
} from '../utils/index';

interface GetTablePropsParams {
  data: SDMXData;
  layoutIds: TableLayout;
  customAttributes?: string[];
  limit?: number;
  isTimeInverted?: boolean;
}

// Decline observations over attributes (for duplicated cells)
const declineObservationsOverAttributes = (
  attributeIds: string[],
  observations: SDMXObservation[]
): SDMXObservation[] => {
  if (!attributeIds.length) return observations;
  
  const declined: SDMXObservation[] = [];
  
  observations.forEach(obs => {
    // Create base observation without attributes
    const baseObs = { ...obs };
    attributeIds.forEach(attrId => {
      delete baseObs[attrId];
    });
    
    // Create one observation per attribute
    declined.push({ ...baseObs, OBS_ATTRIBUTES: 'OBS_VALUE' });
    
    attributeIds.forEach(attrId => {
      if (obs[attrId] !== undefined) {
        declined.push({
          ...baseObs,
          OBS_ATTRIBUTES: attrId,
          value: obs[attrId],
        });
      }
    });
  });
  
  return declined;
};

// Get series combinations
const getSeriesCombinations = (
  combinations: any[],
  oneValueDimensions: SDMXDimension[]
): any[] => {
  // Simplified implementation
  return combinations || [];
};

// Main function to get table props
export const getTableProps = ({
  data,
  layoutIds,
  customAttributes = [],
  limit = 1000000,
  isTimeInverted = false,
}: GetTablePropsParams): TableProps => {
  const {
    observations = [],
    dimensions = [],
    attributes = [],
    combinations = [],
    metadata = [],
    header = {},
  } = data;

  // Filter observation attributes
  const obsAttributes = attributes.filter(
    (a: SDMXAttribute) => 
      a.observation && 
      a.display && 
      !a.combined &&
      (!a.relationship || a.relationship.length === 0)
  );

  // Check if we need to duplicate cells for attributes
  const hasDuplicatedCells = layoutIds.header.includes('OBS_ATTRIBUTES') ||
                             layoutIds.sections.includes('OBS_ATTRIBUTES') ||
                             layoutIds.rows.includes('OBS_ATTRIBUTES');

  let processedObservations = observations;
  
  if (hasDuplicatedCells && obsAttributes.length > 0) {
    const attrIds = obsAttributes.map((a: SDMXAttribute) => a.id);
    processedObservations = declineObservationsOverAttributes(attrIds, observations);
  }

  // Get one-value and many-value dimensions
  const oneValueDims = getOneValueDimensions(dimensions);
  const manyValueDims = getManyValueDimensions(dimensions);
  
  // Get series combinations
  const seriesCombinations = getSeriesCombinations(combinations, oneValueDims);
  
  // Add OBS_ATTRIBUTES as a virtual dimension if needed
  const enhancedDimensions = hasDuplicatedCells
    ? [
        ...dimensions,
        {
          id: 'OBS_ATTRIBUTES',
          name: 'Attributes',
          values: [
            { id: 'OBS_VALUE', name: 'Value' },
            ...obsAttributes.map((a: SDMXAttribute) => ({
              id: a.id,
              name: a.name,
            })),
          ],
        },
      ]
    : dimensions;

  // Get parsed layout
  const parsedLayout = getLayout(
    layoutIds,
    enhancedDimensions,
    seriesCombinations,
    isTimeInverted
  );

  // Get layout data (headers, sections)
  const layoutData = getLayoutData(
    parsedLayout,
    processedObservations,
    enhancedDimensions,
    limit
  );

  // Get cells
  const cells = getCells(
    processedObservations,
    parsedLayout,
    enhancedDimensions,
    customAttributes
  );

  return {
    cells,
    headerData: layoutData.headerData,
    sectionsData: layoutData.sectionsData,
    layout: layoutIds,
    combinations: seriesCombinations,
    totalCells: layoutData.totalCells,
    truncated: layoutData.truncated,
  };
};
