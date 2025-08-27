import React from 'react';
import { useSelector } from 'react-redux';
import { Tag, Space, Typography, Card } from 'antd';
import { FilterOutlined, CloseOutlined } from '@ant-design/icons';
import * as R from 'ramda';
import { getFilters } from '../selectors/sdmx';
import { getDimensions } from '../selectors/sdmx';

const { Text } = Typography;

/**
 * VisUsedFilters Component
 * Displays currently active filters as tags
 * Migrated to AntD + TypeScript
 */
const VisUsedFilters: React.FC = () => {
  const filters = useSelector(getFilters);
  const dimensions = useSelector(getDimensions);

  // Get active filters
  const activeFilters = React.useMemo(() => {
    const active: any[] = [];
    
    Object.entries(filters || {}).forEach(([dimId, values]: [string, any]) => {
      if (values && values.length > 0) {
        const dimension = dimensions?.find((d: any) => d.id === dimId);
        active.push({
          dimensionId: dimId,
          dimensionLabel: dimension?.label || dimId,
          values: values,
        });
      }
    });
    
    return active;
  }, [filters, dimensions]);

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <Card size="small" className="vis-used-filters">
      <Space size="small" wrap>
        <FilterOutlined style={{ color: '#1890ff' }} />
        <Text type="secondary">Active Filters:</Text>
        
        {activeFilters.map((filter) => (
          <Tag
            key={filter.dimensionId}
            closable
            onClose={() => {
              // Dispatch action to remove filter
              console.log('Remove filter:', filter.dimensionId);
            }}
            color="blue"
          >
            <Text strong>{filter.dimensionLabel}:</Text> {filter.values.join(', ')}
          </Tag>
        ))}
        
        <Tag
          color="error"
          style={{ cursor: 'pointer' }}
          onClick={() => {
            // Dispatch action to clear all filters
            console.log('Clear all filters');
          }}
        >
          <CloseOutlined /> Clear All
        </Tag>
      </Space>
    </Card>
  );
};

export default VisUsedFilters;
