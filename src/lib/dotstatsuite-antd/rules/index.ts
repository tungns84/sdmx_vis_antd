// Export all rules and utilities
export * from './types';
export * from './utils/index';
export * from './table/getTableProps';
export * from './table/getLayout';
export * from './table/getCells';
export * from './table/getLayoutData';

// Main rules object (compatible with original rules2)
import { getTableProps } from './table/getTableProps';
import { 
  isTimePeriodDimension,
  formatObservationValue,
  getOneValueDimensions,
  getManyValueDimensions,
} from './utils/index';

export const rules = {
  // Table functions
  getTableProps,
  
  // Utility functions
  isTimePeriodDimension,
  formatObservationValue,
  getOneValueDimensions,
  getManyValueDimensions,
  
  // Label accessors (for compatibility)
  getTableLabelAccessor: (display: string) => (item: any) => {
    if (!item) return '';
    
    if (display === 'id') {
      return item.id || '';
    }
    
    if (display === 'name') {
      return item.name || item.id || '';
    }
    
    // Default: show name with id in parentheses if different
    if (item.name && item.id && item.name !== item.id) {
      return `${item.name} (${item.id})`;
    }
    
    return item.name || item.id || '';
  },
  
  // Layout helpers
  injectCombinationsInLayout: (combinations: any[], layout: any) => {
    // Simplified implementation
    return layout;
  },
};

// Default export for compatibility
export default rules;
