import * as R from 'ramda';
import { 
  SDMXDimension, 
  SDMXCombination, 
  TableLayout 
} from '../types';
import { isTimePeriodDimension } from '../utils/index';

interface LayoutEntry {
  id?: string;
  dimensions?: SDMXDimension[];
}

interface ParsedLayout {
  header: LayoutEntry[];
  sections: LayoutEntry[];
  rows: LayoutEntry[];
}

// Get concepts set for layout level
const getConceptsSet = (
  ids: string[],
  indexedCombinations: Record<string, SDMXCombination>,
  upper?: Set<string>
): Set<string> => {
  const upperSet = upper || new Set<string>();
  const result = new Set<string>();
  
  ids.forEach(id => {
    if (!indexedCombinations[id]) {
      result.add(id);
    } else {
      const combination = indexedCombinations[id];
      combination.concepts.forEach(conceptId => {
        if (!upperSet.has(conceptId)) {
          result.add(conceptId);
        }
      });
    }
  });
  
  return result;
};

// Parse combination for layout
const parseCombination = (
  combination: SDMXCombination,
  indexedDimensions: Record<string, SDMXDimension>,
  upperIds: Set<string>,
  excludedIds: Set<string>
): LayoutEntry | SDMXDimension[] => {
  const { concepts, relationship } = combination;
  
  const dimensions = concepts.reduce<SDMXDimension[]>((acc, id) => {
    if (upperIds.has(id) || !indexedDimensions[id]) {
      return acc;
    }
    const dim = indexedDimensions[id];
    return [...acc, dim];
  }, []);
  
  const hasExcludedDep = relationship.some(id => excludedIds.has(id));
  if (hasExcludedDep) {
    return dimensions;
  }
  
  return { ...combination, dimensions };
};

// Get layout level
const getLayoutLevel = (
  ids: string[],
  indexedDimensions: Record<string, SDMXDimension>,
  indexedCombinations: Record<string, SDMXCombination>,
  upperIds: Set<string>,
  excludedIds: Set<string>
): LayoutEntry[] => {
  return ids.reduce<LayoutEntry[]>((acc, id) => {
    // Direct dimension
    if (indexedDimensions[id]) {
      const dim = indexedDimensions[id];
      return [...acc, dim];
    }
    
    // Combination
    if (indexedCombinations[id]) {
      const combination = indexedCombinations[id];
      const parsed = parseCombination(
        combination,
        indexedDimensions,
        upperIds,
        excludedIds
      );
      
      if (Array.isArray(parsed)) {
        return [...acc, ...parsed];
      }
      return [...acc, parsed];
    }
    
    return acc;
  }, []);
};

// Main function to get layout
export const getLayout = (
  layoutIds: TableLayout,
  dimensions: SDMXDimension[],
  combinations: SDMXCombination[] = [],
  isTimeInverted: boolean = false
): ParsedLayout => {
  // Apply time inversion if needed
  const applyTimeInversion = (dim: SDMXDimension): SDMXDimension => {
    if (isTimePeriodDimension(dim) && isTimeInverted) {
      return { ...dim, isInverted: true };
    }
    return dim;
  };
  
  // Index dimensions and combinations
  const indexedDimensions = dimensions.reduce<Record<string, SDMXDimension>>(
    (acc, dim) => ({ ...acc, [dim.id]: applyTimeInversion(dim) }),
    {}
  );
  
  const indexedCombinations = R.indexBy(R.prop('id'), combinations);
  
  // Get concept sets
  const headerConceptsSet = getConceptsSet(
    layoutIds.header,
    indexedCombinations
  );
  
  const sectionsConceptsSet = getConceptsSet(
    layoutIds.sections,
    indexedCombinations
  );
  
  const rowsConceptsSet = getConceptsSet(
    [...layoutIds.sections, ...layoutIds.rows],
    indexedCombinations
  );
  
  // Build layout levels
  const header = getLayoutLevel(
    layoutIds.header,
    indexedDimensions,
    indexedCombinations,
    new Set(),
    rowsConceptsSet
  );
  
  const sections = getLayoutLevel(
    layoutIds.sections,
    indexedDimensions,
    indexedCombinations,
    new Set(),
    headerConceptsSet
  );
  
  const rows = getLayoutLevel(
    layoutIds.rows,
    indexedDimensions,
    indexedCombinations,
    sectionsConceptsSet,
    headerConceptsSet
  );
  
  return { header, sections, rows };
};
