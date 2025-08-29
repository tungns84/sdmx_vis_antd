import React, { useState, useCallback, useMemo, memo } from 'react';
import { Modal, Button, Badge, Space, Typography, Statistic, Row, Col } from 'antd';
import { FilterOutlined, ClearOutlined, CheckOutlined, CloseOutlined, ReloadOutlined } from '@ant-design/icons';
import { FormattedMessage, useIntl } from 'react-intl';
import { FilterSidebar, filterObservations } from './index';
import { SDMXDimension, SDMXObservation } from '../../types';

const { Text } = Typography;

interface FilterModalProps {
  dimensions: SDMXDimension[];
  observations: SDMXObservation[];
  activeFilters: Record<string, string[]>;
  onFiltersChange: (filters: Record<string, string[]>) => void;
  onClose: () => void;
  showCounts?: boolean;
  layoutDimensions?: string[];
}

/**
 * Filter Modal Component with i18n
 * Provides filtering interface in a modal dialog
 */
export const FilterModalWithI18n: React.FC<FilterModalProps> = memo(({
  dimensions,
  observations,
  activeFilters,
  onFiltersChange,
  onClose,
  showCounts = true,
  layoutDimensions = []
}) => {
  const intl = useIntl();
  const [tempFilters, setTempFilters] = useState<Record<string, string[]>>(activeFilters);
  const [visible, setVisible] = useState(true);

  // Calculate filtered observations and statistics
  const filteredObservations = useMemo(() => 
    filterObservations(observations, tempFilters),
    [observations, tempFilters]
  );

  const filterStats = useMemo(() => {
    const activeCount = Object.values(tempFilters).filter(v => v.length > 0).length;
    const totalSelections = Object.values(tempFilters).reduce((sum, v) => sum + v.length, 0);
    const percentage = observations.length > 0 
      ? Math.round((filteredObservations.length / observations.length) * 100)
      : 100;

    return {
      activeCount,
      totalSelections,
      filteredCount: filteredObservations.length,
      totalCount: observations.length,
      percentage
    };
  }, [tempFilters, filteredObservations.length, observations.length]);

  // Handlers
  const handleApply = useCallback(() => {
    onFiltersChange(tempFilters);
    onClose();
  }, [tempFilters, onFiltersChange, onClose]);

  const handleCancel = useCallback(() => {
    setVisible(false);
    onClose();
  }, [onClose]);

  const handleClearAll = useCallback(() => {
    const clearedFilters: Record<string, string[]> = {};
    dimensions.forEach(dim => {
      clearedFilters[dim.id] = [];
    });
    setTempFilters(clearedFilters);
  }, [dimensions]);

  const handleReset = useCallback(() => {
    setTempFilters(activeFilters);
  }, [activeFilters]);

  const modalTitle = (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: 40 }}>
      <Space>
        <FilterOutlined />
        <FormattedMessage id="filter.title" />
      </Space>
      <Space size="large">
        <Badge count={filterStats.activeCount} showZero style={{ backgroundColor: '#52c41a' }}>
          <Text type="secondary">
            <FormattedMessage 
              id="filter.stats.dimensions" 
              values={{ count: filterStats.activeCount }}
              defaultMessage="{count} dimensions"
            />
          </Text>
        </Badge>
        <Badge count={filterStats.totalSelections} showZero style={{ backgroundColor: '#1890ff' }}>
          <Text type="secondary">
            <FormattedMessage 
              id="filter.stats.selections" 
              values={{ count: filterStats.totalSelections }}
              defaultMessage="{count} selections"
            />
          </Text>
        </Badge>
        <Text strong>
          <FormattedMessage 
            id="filter.stats.showing" 
            values={{
              filtered: filterStats.filteredCount,
              total: filterStats.totalCount,
              percentage: filterStats.percentage
            }}
            defaultMessage="{filtered}/{total} ({percentage}%)"
          />
        </Text>
      </Space>
    </div>
  );

  return (
    <Modal
      title={modalTitle}
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button 
          key="clear" 
          icon={<ClearOutlined />} 
          onClick={handleClearAll}
          disabled={filterStats.totalSelections === 0}
        >
          <FormattedMessage id="filter.clearAll" />
        </Button>,
        <Button 
          key="reset" 
          icon={<ReloadOutlined />} 
          onClick={handleReset}
        >
          <FormattedMessage id="filter.reset" />
        </Button>,
        <Button 
          key="cancel" 
          icon={<CloseOutlined />} 
          onClick={handleCancel}
        >
          <FormattedMessage id="filter.cancel" />
        </Button>,
        <Button 
          key="apply" 
          type="primary" 
          icon={<CheckOutlined />} 
          onClick={handleApply}
        >
          <FormattedMessage id="filter.apply" />
        </Button>,
      ]}
      width={800}
      style={{ top: 20 }}
      destroyOnClose
    >
      <div style={{ 
        display: 'flex', 
        height: 'calc(100vh - 250px)',
        overflowY: 'auto' 
      }}>
        <FilterSidebar
          dimensions={dimensions}
          observations={observations}
          activeFilters={tempFilters}
          onFiltersChange={setTempFilters}
          showCounts={showCounts}
          isMobile={false}
          layoutDimensions={layoutDimensions}
        />
      </div>
    </Modal>
  );
});

FilterModalWithI18n.displayName = 'FilterModalWithI18n';

export default FilterModalWithI18n;
