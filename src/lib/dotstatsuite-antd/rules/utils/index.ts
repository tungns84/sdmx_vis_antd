import * as R from 'ramda';
import { SDMXDimension, SDMXDimensionValue, SDMXObservation } from '../types';

// Check if dimension is time period
export const isTimePeriodDimension = (dimension: SDMXDimension): boolean => {
  return dimension.role === 'time' || 
         dimension.id === 'TIME_PERIOD' || 
         dimension.id === 'TIME' ||
         !!dimension.isTimePeriod;
};

// Get dimension by ID
export const getDimensionById = (dimensions: SDMXDimension[], id: string): SDMXDimension | undefined => {
  return dimensions.find(d => d.id === id);
};

// Get dimension value by ID
export const getDimensionValueById = (
  dimension: SDMXDimension, 
  valueId: string
): SDMXDimensionValue | undefined => {
  return dimension.values.find(v => v.id === valueId);
};

// Index observations by key
export const indexObservations = (
  observations: SDMXObservation[],
  keyGetter: (obs: SDMXObservation) => string
): Record<string, SDMXObservation[]> => {
  const grouped = R.groupBy(keyGetter, observations);
  // Ensure all values are defined (not undefined)
  const result: Record<string, SDMXObservation[]> = {};
  Object.keys(grouped).forEach(key => {
    const value = grouped[key];
    if (value) {
      result[key] = value;
    }
  });
  return result;
};

// Get observation key
export const getObservationKey = (
  observation: SDMXObservation,
  dimensionIds: string[]
): string => {
  return dimensionIds
    .map(id => observation[id] || '')
    .filter(Boolean)
    .join(':');
};

// Filter dimensions by IDs
export const filterDimensionsByIds = (
  dimensions: SDMXDimension[],
  ids: string[]
): SDMXDimension[] => {
  return dimensions.filter(d => ids.includes(d.id));
};

// Get one-value dimensions (dimensions with only one value)
export const getOneValueDimensions = (
  dimensions: SDMXDimension[]
): SDMXDimension[] => {
  return dimensions.filter(d => d.values.length === 1);
};

// Get many-value dimensions
export const getManyValueDimensions = (
  dimensions: SDMXDimension[]
): SDMXDimension[] => {
  return dimensions.filter(d => d.values.length > 1);
};

// Sort dimension values
export const sortDimensionValues = (
  values: SDMXDimensionValue[],
  isInverted: boolean = false
): SDMXDimensionValue[] => {
  const sorted = [...values].sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    return a.id.localeCompare(b.id);
  });
  
  return isInverted ? sorted.reverse() : sorted;
};

// Flatten hierarchical dimension values
export const flattenHierarchicalValues = (
  values: SDMXDimensionValue[],
  parentId?: string
): SDMXDimensionValue[] => {
  const result: SDMXDimensionValue[] = [];
  
  values.forEach(value => {
    const flatValue = { ...value };
    if (parentId) {
      flatValue.parent = parentId;
    }
    result.push(flatValue);
    
    if (value.children && value.children.length > 0) {
      result.push(...flattenHierarchicalValues(value.children, value.id));
    }
  });
  
  return result;
};

// Check if observation has value
export const hasObservationValue = (observation: SDMXObservation): boolean => {
  return observation.value !== undefined && 
         observation.value !== null && 
         observation.value !== '';
};

// Format observation value
export const formatObservationValue = (
  value: any,
  format?: string
): string => {
  if (value === null || value === undefined) {
    return '';
  }
  
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  
  if (typeof value === 'number') {
    // Apply number formatting if needed
    return value.toLocaleString();
  }
  
  return String(value);
};

// Get unique dimension values from observations
export const getUniqueDimensionValues = (
  observations: SDMXObservation[],
  dimensionId: string
): string[] => {
  const values = observations
    .map(obs => obs[dimensionId])
    .filter(Boolean);
  
  return [...new Set(values)];
};

// Create empty observation
export const createEmptyObservation = (
  dimensionIds: string[]
): SDMXObservation => {
  const obs: SDMXObservation = {};
  dimensionIds.forEach(id => {
    obs[id] = '';
  });
  return obs;
};

// Export all utilities
export default {
  isTimePeriodDimension,
  getDimensionById,
  getDimensionValueById,
  indexObservations,
  getObservationKey,
  filterDimensionsByIds,
  getOneValueDimensions,
  getManyValueDimensions,
  sortDimensionValues,
  flattenHierarchicalValues,
  hasObservationValue,
  formatObservationValue,
  getUniqueDimensionValues,
  createEmptyObservation,
};