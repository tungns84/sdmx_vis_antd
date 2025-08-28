/**
 * Filter Modal Component
 * Modal-based filter interface similar to Layout
 */

import React, { useState, useCallback, useMemo, memo } from 'react';
import { Modal, Button, Badge, message, Row, Col, Statistic } from 'antd';
import { FilterOutlined, ClearOutlined } from '@ant-design/icons';
import FilterPanel from './FilterPanel';
import UsedFilters from './UsedFilters';
import type { SDMXDimension as Dimension, SDMXObservation as Observation } from '../../types';
import './filterStyles.css';

export interface FilterModalProps {
  dimensions: Dimension[];
  observations?: Observation[];
  activeFilters: Record<string, string[]>;
  onFiltersChange: (filters: Record<string, string[]>) => void;
  showCounts?: boolean;
  onClose: () => void;
  layoutDimensions?: string[];
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
 * Modal containing all filter panels
 */
export const FilterModal: React.FC<FilterModalProps> = memo(({
  dimensions,
  observations = [],
  activeFilters,
  onFiltersChange,
  showCounts = true,
  onClose,
  layoutDimensions = []
}) => {
  const [visible, setVisible] = useState(true);
  const [tempFilters, setTempFilters] = useState(activeFilters);
  
  // Manage expanded state for each dimension panel
  const [expandedPanels, setExpandedPanels] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    dimensions.forEach(dim => {
      initial[dim.id] = true;
    });
    return initial;
  });

  // Calculate filter statistics
  const filterStats = useMemo(() => {
    const hasActiveFilters = Object.values(tempFilters).some(values => values.length > 0);
    
    if (!hasActiveFilters || !observations || observations.length === 0) {
      return null;
    }

    // Count filtered observations
    const filteredCount = observations.filter(obs => {
      return Object.entries(tempFilters).every(([dimensionId, selectedValues]) => {
        if (selectedValues.length === 0) return true;
        return selectedValues.includes(obs[dimensionId]);
      });
    }).length;

    return {
      totalObservations: observations.length,
      filteredObservations: filteredCount,
      activeFilters: Object.values(tempFilters).filter(v => v.length > 0).length,
      percentage: Math.round((filteredCount / observations.length) * 100)
    };
  }, [tempFilters, observations]);

  // Convert filters to ActiveFilter format
  const activeFiltersList = useMemo(() => {
    return Object.entries(tempFilters)
      .filter(([_, values]) => values.length > 0)
      .map(([dimId, values]) => {
        const dimension = dimensions.find(d => d.id === dimId);
        return {
          dimensionId: dimId,
          values,
          label: dimension?.name || dimId
        };
      });
  }, [tempFilters, dimensions]);

  // Update filters for a dimension
  const updateDimensionFilter = useCallback((dimensionId: string, values: string[]) => {
    const newFilters = {
      ...tempFilters,
      [dimensionId]: values
    };
    setTempFilters(newFilters);
  }, [tempFilters]);

  // Remove filter
  const removeFilter = useCallback((dimensionId: string, valueId?: string) => {
    if (valueId) {
      // Remove single value
      const currentValues = tempFilters[dimensionId] || [];
      updateDimensionFilter(dimensionId, currentValues.filter(v => v !== valueId));
    } else {
      // Remove all values for dimension
      updateDimensionFilter(dimensionId, []);
    }
  }, [tempFilters, updateDimensionFilter]);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    const emptyFilters: Record<string, string[]> = {};
    dimensions.forEach(dim => {
      emptyFilters[dim.id] = [];
    });
    setTempFilters(emptyFilters);
  }, [dimensions]);
  
  // Toggle panel expansion
  const togglePanel = useCallback((dimensionId: string) => {
    setExpandedPanels(prev => ({
      ...prev,
      [dimensionId]: !prev[dimensionId]
    }));
  }, []);

  // Apply filters
  const handleApply = useCallback(() => {
    onFiltersChange(tempFilters);
    const activeCount = Object.values(tempFilters).filter(v => v.length > 0).length;
    if (activeCount > 0) {
      message.success(`Applied ${activeCount} filter${activeCount > 1 ? 's' : ''}`);
    } else {
      message.info('All filters cleared');
    }
    setVisible(false);
    onClose();
  }, [tempFilters, onFiltersChange, onClose]);

  // Cancel changes
  const handleCancel = useCallback(() => {
    setVisible(false);
    onClose();
  }, [onClose]);

  // Reset filters to original
  const handleReset = useCallback(() => {
    setTempFilters(activeFilters);
    message.info('Filters reset to original state');
  }, [activeFilters]);

  // Count total active filters
  const totalFilterCount = Object.values(tempFilters)
    .reduce((sum, values) => sum + values.length, 0);

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FilterOutlined />
          <span>Filters</span>
          {totalFilterCount > 0 && (
            <Badge count={totalFilterCount} style={{ marginLeft: 8 }} />
          )}
        </div>
      }
      open={visible}
      onOk={handleApply}
      onCancel={handleCancel}
      width={800}
      style={{ top: 20 }}
      bodyStyle={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}
      footer={[
        <Button key="clear" icon={<ClearOutlined />} onClick={clearAllFilters}>
          Clear All
        </Button>,
        <Button key="reset" onClick={handleReset}>
          Reset
        </Button>,
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="apply" type="primary" onClick={handleApply}>
          Apply Filters
        </Button>,
      ]}
    >
      {/* Filter Statistics */}
      {filterStats && (
        <div style={{ marginBottom: 16, padding: 12, background: '#fafafa', borderRadius: 4 }}>
          <Row gutter={16}>
            <Col span={6}>
              <Statistic
                title="Total"
                value={filterStats.totalObservations}
                valueStyle={{ fontSize: 16 }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Filtered"
                value={filterStats.filteredObservations}
                valueStyle={{ fontSize: 16, color: filterStats.activeFilters > 0 ? '#3f8600' : undefined }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Active Filters"
                value={filterStats.activeFilters}
                valueStyle={{ fontSize: 16, color: filterStats.activeFilters > 0 ? '#cf1322' : undefined }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Showing"
                value={filterStats.percentage}
                suffix="%"
                valueStyle={{ fontSize: 16 }}
              />
            </Col>
          </Row>
        </div>
      )}

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
            ? calculateCounts(observations, dimension, tempFilters)
            : undefined;

          return (
            <FilterPanel
              key={dimension.id}
              dimension={dimension}
              selectedValues={tempFilters[dimension.id] || []}
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
    </Modal>
  );
});

FilterModal.displayName = 'FilterModal';

export default FilterModal;
