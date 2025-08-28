/**
 * Filter Components Export
 */

export { FilterPanel } from './FilterPanel';
export type { FilterPanelProps, ActiveFilter } from './FilterPanel';

export { UsedFilters } from './UsedFilters';
export type { UsedFiltersProps } from './UsedFilters';

export { FilterSidebar } from './FilterSidebar';
export type { FilterSidebarProps } from './FilterSidebar';

export { FilterModal } from './FilterModal';
export type { FilterModalProps } from './FilterModal';

// Utility functions for filtering data
export function filterObservations(
  observations: any[],
  filters: Record<string, string[]>
): any[] {
  if (!observations || observations.length === 0) {
    return [];
  }

  // If no filters active, return all observations
  const hasActiveFilters = Object.values(filters).some(values => values.length > 0);
  if (!hasActiveFilters) {
    return observations;
  }

  // Filter observations based on active filters
  return observations.filter(obs => {
    return Object.entries(filters).every(([dimensionId, selectedValues]) => {
      // If no values selected for this dimension, don't filter by it
      if (selectedValues.length === 0) {
        return true;
      }
      
      // Check if observation has one of the selected values
      return selectedValues.includes(obs[dimensionId]);
    });
  });
}

// Get unique values for a dimension from observations
export function getDimensionValues(
  observations: any[],
  dimensionId: string
): string[] {
  const uniqueValues = new Set<string>();
  
  observations.forEach(obs => {
    if (obs[dimensionId]) {
      uniqueValues.add(obs[dimensionId]);
    }
  });
  
  return Array.from(uniqueValues);
}

// Count observations for each dimension value
export function countDimensionValues(
  observations: any[],
  dimensionId: string
): Record<string, number> {
  const counts: Record<string, number> = {};
  
  observations.forEach(obs => {
    const value = obs[dimensionId];
    if (value) {
      counts[value] = (counts[value] || 0) + 1;
    }
  });
  
  return counts;
}
