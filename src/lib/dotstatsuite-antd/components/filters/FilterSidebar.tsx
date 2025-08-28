/**
 * FilterSidebar Component
 * Container for all dimension filters
 */

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Drawer, Button, Badge } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import FilterPanel, { ActiveFilter } from './FilterPanel';
import UsedFilters from './UsedFilters';
import type { SDMXDimension as Dimension, SDMXObservation as Observation } from '../../types';
import './filterStyles.css';

export interface FilterSidebarProps {
  dimensions: Dimension[];
  observations?: Observation[];
  activeFilters: Record<string, string[]>;
  onFiltersChange: (filters: Record<string, string[]>) => void;
  showCounts?: boolean;
  isMobile?: boolean;
  layoutDimensions?: string[];  // Dimensions currently used in table layout
}

/**
 * Calculate observation counts for each dimension value
 */
const calculateCounts = (
  observations: Observation[],
  dimension: Dimension,
  activeFilters: Record<string, string[]>
): Record<string, number> => {
  const counts: Record<string, number> = {};
  
  // Initialize counts
  dimension.values.forEach(v => {
    counts[v.id] = 0;
  });
  
  // Count observations
  observations.forEach(obs => {
    // Check if observation matches current filters (excluding this dimension)
    const matchesFilters = Object.entries(activeFilters).every(([dimId, values]) => {
      if (dimId === dimension.id || values.length === 0) return true;
      return values.includes(obs[dimId]);
    });
    
    if (matchesFilters && obs[dimension.id]) {
      const valueId = obs[dimension.id];
      if (counts[valueId] !== undefined) {
        counts[valueId]++;
      }
    }
  });
  
  return counts;
};

/**
 * Sidebar containing all filter panels
 */
export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  dimensions,
  observations = [],
  activeFilters,
  onFiltersChange,
  showCounts = true,
  isMobile = false,
  layoutDimensions = []
}) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  
  // Manage expanded state for each dimension panel
  const [expandedPanels, setExpandedPanels] = useState<Record<string, boolean>>(() => {
    // Initialize all panels as expanded
    const initial: Record<string, boolean> = {};
    dimensions.forEach(dim => {
      initial[dim.id] = true;
    });
    return initial;
  });
  
  // Update expanded panels when dimensions change
  useEffect(() => {
    setExpandedPanels(prev => {
      const updated = { ...prev };
      dimensions.forEach(dim => {
        if (!(dim.id in updated)) {
          updated[dim.id] = true;  // New dimensions default to expanded
        }
      });
      return updated;
    });
  }, [dimensions]);

  // Convert filters to ActiveFilter format
  const activeFiltersList: ActiveFilter[] = useMemo(() => {
    return Object.entries(activeFilters)
      .filter(([_, values]) => values.length > 0)
      .map(([dimId, values]) => {
        const dimension = dimensions.find(d => d.id === dimId);
        return {
          dimensionId: dimId,
          values,
          label: dimension?.name || dimId
        };
      });
  }, [activeFilters, dimensions]);

  // Update filters for a dimension
  const updateDimensionFilter = useCallback((dimensionId: string, values: string[]) => {
    const newFilters = {
      ...activeFilters,
      [dimensionId]: values
    };
    onFiltersChange(newFilters);
  }, [activeFilters, onFiltersChange]);

  // Remove filter
  const removeFilter = useCallback((dimensionId: string, valueId?: string) => {
    if (valueId) {
      // Remove single value
      const newValues = activeFilters[dimensionId].filter(v => v !== valueId);
      updateDimensionFilter(dimensionId, newValues);
    } else {
      // Remove all values for dimension
      updateDimensionFilter(dimensionId, []);
    }
  }, [activeFilters, updateDimensionFilter]);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    const emptyFilters: Record<string, string[]> = {};
    dimensions.forEach(dim => {
      emptyFilters[dim.id] = [];
    });
    onFiltersChange(emptyFilters);
  }, [dimensions, onFiltersChange]);
  
  // Toggle panel expansion
  const togglePanel = useCallback((dimensionId: string) => {
    setExpandedPanels(prev => ({
      ...prev,
      [dimensionId]: !prev[dimensionId]
    }));
  }, []);

  // Count total active filters
  const totalFilterCount = Object.values(activeFilters)
    .reduce((sum, values) => sum + values.length, 0);

  // Filter content component
  const FilterContent = () => (
    <>
      {/* Used Filters */}
      {totalFilterCount > 0 && (
        <UsedFilters
          filters={activeFiltersList}
          onRemove={removeFilter}
          onClearAll={clearAllFilters}
        />
      )}

      {/* Filter Panels */}
      <div className="filter-panels-container">
        {dimensions.map(dimension => {
          const counts = showCounts && observations.length > 0
            ? calculateCounts(observations, dimension, activeFilters)
            : undefined;

          return (
            <FilterPanel
              key={dimension.id}
              dimension={dimension}
              selectedValues={activeFilters[dimension.id] || []}
              availableCounts={counts}
              onSelectionChange={(values) => updateDimensionFilter(dimension.id, values)}
              showSearch={dimension.values.length > 10}
              showCounts={showCounts}
              isInLayout={layoutDimensions.includes(dimension.id)}
              expanded={expandedPanels[dimension.id] ?? true}
              onToggle={() => togglePanel(dimension.id)}
            />
          );
        })}
      </div>
    </>
  );

  // Mobile view - use drawer
  if (isMobile) {
    return (
      <>
        <Button
          icon={<FilterOutlined />}
          onClick={() => setDrawerVisible(true)}
          className="filter-toggle-button"
        >
          Filters
          {totalFilterCount > 0 && (
            <Badge 
              count={totalFilterCount} 
              style={{ marginLeft: 8 }}
            />
          )}
        </Button>

        <Drawer
          title="Filters"
          placement="left"
          onClose={() => setDrawerVisible(false)}
          visible={drawerVisible}
          width="90%"
          className="filter-drawer"
        >
          <FilterContent />
        </Drawer>
      </>
    );
  }

  // Desktop view - inline sidebar
  return (
    <div className="filter-sidebar">
      <div className="filter-sidebar-header">
        <FilterOutlined style={{ marginRight: 8 }} />
        <span>Filters</span>
        {totalFilterCount > 0 && (
          <Badge 
            count={totalFilterCount} 
            style={{ marginLeft: 'auto' }}
          />
        )}
      </div>
      
      <FilterContent />
    </div>
  );
};

export default FilterSidebar;
