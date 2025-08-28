/**
 * FilterPanel Component
 * Main filter panel for dimension-based data filtering
 */

import React, { useState, useMemo, useCallback } from 'react';
import { Input, Checkbox, Badge, Collapse, Button, Space, Empty, Tag, Tooltip } from 'antd';
import { SearchOutlined, DownOutlined, UpOutlined, ClearOutlined, TableOutlined } from '@ant-design/icons';
import type { SDMXDimension as Dimension, SDMXDimensionValue as DimensionValue } from '../../types';
import './filterStyles.css';

const { Panel } = Collapse;

export interface ActiveFilter {
  dimensionId: string;
  values: string[];
  label?: string;
}

export interface FilterPanelProps {
  dimension: Dimension;
  selectedValues: string[];
  availableCounts?: Record<string, number>;
  onSelectionChange: (values: string[]) => void;
  showSearch?: boolean;
  showCounts?: boolean;
  showSelectAll?: boolean;
  expandedByDefault?: boolean;
  maxHeight?: number;
  isInLayout?: boolean;  // Indicate if dimension is used in table layout
  expanded?: boolean;  // Controlled expanded state
  onToggle?: () => void;  // Callback when panel is toggled
}

/**
 * Individual filter item with checkbox
 */
const FilterItem: React.FC<{
  value: DimensionValue;
  selected: boolean;
  count?: number;
  level?: number;
  onToggle: () => void;
  disabled?: boolean;
}> = ({ value, selected, count, level = 0, onToggle, disabled }) => {
  return (
    <div 
      className={`filter-item ${selected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
      style={{ paddingLeft: `${level * 20 + 8}px` }}
    >
      <Checkbox
        checked={selected}
        onChange={onToggle}
        disabled={disabled}
        style={{ width: '100%' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: '8px' }}>
          <span className="filter-item-label" title={value.name || value.id}>
            {value.name || value.id}
          </span>
          {count !== undefined && (
            <span className="filter-item-count" style={{ flexShrink: 0, marginLeft: 'auto' }}>({count})</span>
          )}
        </div>
      </Checkbox>
    </div>
  );
};

/**
 * Filter panel for a single dimension
 */
export const FilterPanel: React.FC<FilterPanelProps> = ({
  dimension,
  selectedValues = [],
  availableCounts = {},
  onSelectionChange,
  showSearch = true,
  showCounts = true,
  showSelectAll = true,
  expandedByDefault = true,
  maxHeight = 300,
  isInLayout = false,
  expanded,
  onToggle
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  // Use controlled state if provided, otherwise use local state
  const [localExpanded, setLocalExpanded] = useState(expandedByDefault);
  const isExpanded = expanded !== undefined ? expanded : localExpanded;
  const handleToggle = onToggle || (() => setLocalExpanded(!localExpanded));

  // Filter values based on search
  const filteredValues = useMemo(() => {
    if (!searchTerm) return dimension.values;
    
    const term = searchTerm.toLowerCase();
    return dimension.values.filter(v => {
      const label = (v.name || v.id).toLowerCase();
      return label.includes(term);
    });
  }, [dimension.values, searchTerm]);

  // Check if value is selected
  const isSelected = useCallback((valueId: string) => {
    return selectedValues.includes(valueId);
  }, [selectedValues]);

  // Toggle single value
  const toggleValue = useCallback((valueId: string) => {
    const newValues = isSelected(valueId)
      ? selectedValues.filter(v => v !== valueId)
      : [...selectedValues, valueId];
    onSelectionChange(newValues);
  }, [selectedValues, isSelected, onSelectionChange]);

  // Select all visible values
  const selectAll = useCallback(() => {
    const allValueIds = filteredValues.map(v => v.id);
    const newValues = Array.from(new Set([...selectedValues, ...allValueIds]));
    onSelectionChange(newValues);
  }, [filteredValues, selectedValues, onSelectionChange]);

  // Deselect all visible values
  const deselectAll = useCallback(() => {
    const visibleIds = filteredValues.map(v => v.id);
    const newValues = selectedValues.filter(v => !visibleIds.includes(v));
    onSelectionChange(newValues);
  }, [filteredValues, selectedValues, onSelectionChange]);

  // Clear all selections
  const clearAll = useCallback(() => {
    onSelectionChange([]);
    setSearchTerm('');
  }, [onSelectionChange]);

  // Count selected items
  const selectedCount = selectedValues.length;
  const totalCount = dimension.values.length;

  // Panel header with badge and layout indicator
  const panelHeader = (
    <div className="filter-panel-header">
      <span className="filter-panel-title">
        {dimension.name || dimension.id}
        {isInLayout && (
          <Tooltip title="This dimension is also used in the table layout">
            <Tag 
              icon={<TableOutlined />} 
              color="blue"
              style={{ marginLeft: 8, fontSize: '11px' }}
            >
              In Table
            </Tag>
          </Tooltip>
        )}
      </span>
      {selectedCount > 0 && (
        <Badge 
          count={selectedCount} 
          className="filter-panel-badge"
          style={{ backgroundColor: '#1890ff' }}
        />
      )}
    </div>
  );

  return (
    <Collapse
      activeKey={isExpanded ? ['1'] : []}
      onChange={handleToggle}
      className="filter-panel-collapse"
      expandIcon={({ isActive }) => 
        isActive ? <UpOutlined /> : <DownOutlined />
      }
    >
      <Panel 
        header={panelHeader} 
        key="1"
        className="filter-panel"
      >
        <div className="filter-panel-content">
          {/* Search input */}
          {showSearch && dimension.values.length > 5 && (
            <div className="filter-search">
              <Input
                placeholder="Search..."
                prefix={<SearchOutlined />}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                allowClear
                size="small"
              />
            </div>
          )}

          {/* Select all/none buttons */}
          {showSelectAll && (
            <div className="filter-actions">
              <Space size="small">
                <Button 
                  size="small" 
                  onClick={selectAll}
                  disabled={filteredValues.length === 0}
                >
                  Select All
                </Button>
                <Button 
                  size="small" 
                  onClick={deselectAll}
                  disabled={selectedCount === 0}
                >
                  Deselect All
                </Button>
                {selectedCount > 0 && (
                  <Button
                    size="small"
                    icon={<ClearOutlined />}
                    onClick={clearAll}
                    danger
                  >
                    Clear
                  </Button>
                )}
              </Space>
            </div>
          )}

          {/* Filter items list */}
          <div 
            className="filter-items-container"
            style={{ maxHeight, overflowY: 'auto' }}
          >
            {filteredValues.length === 0 ? (
              <Empty 
                description="No items found" 
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ) : (
              filteredValues.map(value => (
                <FilterItem
                  key={value.id}
                  value={value}
                  selected={isSelected(value.id)}
                  count={showCounts ? availableCounts[value.id] : undefined}
                  onToggle={() => toggleValue(value.id)}
                  disabled={showCounts && availableCounts[value.id] === 0}
                />
              ))
            )}
          </div>

          {/* Status bar */}
          {filteredValues.length > 0 && (
            <div className="filter-status">
              <span>
                {selectedCount} of {totalCount} selected
                {searchTerm && ` (${filteredValues.length} visible)`}
              </span>
            </div>
          )}
        </div>
      </Panel>
    </Collapse>
  );
};

export default FilterPanel;
