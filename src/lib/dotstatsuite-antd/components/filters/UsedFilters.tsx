/**
 * UsedFilters Component
 * Display and manage currently active filters
 */

import React from 'react';
import { CloseOutlined, ClearOutlined } from '@ant-design/icons';
import type { ActiveFilter } from './FilterPanel';
import './filterStyles.css';

export interface UsedFiltersProps {
  filters: ActiveFilter[];
  onRemove: (dimensionId: string, valueId?: string) => void;
  onClearAll: () => void;
  collapsed?: boolean;
}

/**
 * Filter tag component
 */
const FilterTag: React.FC<{
  label: string;
  onRemove?: () => void;
}> = ({ label, onRemove }) => {
  return (
    <span className="filter-tag">
      <span className="filter-tag-label">{label}</span>
      {onRemove && (
        <CloseOutlined 
          className="filter-tag-remove"
          onClick={onRemove}
        />
      )}
    </span>
  );
};

/**
 * Display active filters with ability to remove
 */
export const UsedFilters: React.FC<UsedFiltersProps> = ({
  filters,
  onRemove,
  onClearAll,
  collapsed = false
}) => {
  // Filter out empty filters
  const activeFilters = filters.filter(f => f.values.length > 0);
  
  if (activeFilters.length === 0) {
    return null;
  }

  // Collapsed view - just show count
  if (collapsed) {
    const totalCount = activeFilters.reduce((sum, f) => sum + f.values.length, 0);
    return (
      <div className="used-filters-panel collapsed">
        <div className="used-filters-summary">
          <span>{totalCount} filter{totalCount !== 1 ? 's' : ''} applied</span>
          <CloseOutlined 
            className="used-filters-clear-icon"
            onClick={onClearAll}
          />
        </div>
      </div>
    );
  }

  // Expanded view - show all filters
  return (
    <div className="used-filters-panel">
      <div className="used-filters-header">
        <span className="used-filters-title">Active Filters</span>
        <span 
          className="used-filters-clear"
          onClick={onClearAll}
        >
          <ClearOutlined /> Clear All
        </span>
      </div>
      
      <div className="used-filters-content">
        {activeFilters.map(filter => (
          <div key={filter.dimensionId} className="filter-dimension-group">
            <span className="filter-dimension-name">
              {filter.label || filter.dimensionId}:
            </span>
            <div className="filter-tags-container">
              {filter.values.map(value => (
                <FilterTag
                  key={value}
                  label={value}
                  onRemove={() => onRemove(filter.dimensionId, value)}
                />
              ))}
            </div>
            <CloseOutlined 
              className="filter-dimension-clear"
              onClick={() => onRemove(filter.dimensionId)}
              title={`Clear all ${filter.label || filter.dimensionId} filters`}
              style={{ marginLeft: 8, color: '#ff4d4f', cursor: 'pointer' }}
            />
          </div>
        ))}
      </div>
      
      {activeFilters.length > 0 && (
        <div style={{ marginTop: 12, textAlign: 'center' }}>
          <a 
            className="clear-all-filters"
            onClick={onClearAll}
          >
            Clear all filters
          </a>
        </div>
      )}
    </div>
  );
};

export default UsedFilters;
