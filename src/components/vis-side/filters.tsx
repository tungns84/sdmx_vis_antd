import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Select, DatePicker, Space, Typography, Tag, Collapse, Badge, Button } from 'antd';
import { FilterOutlined, CalendarOutlined } from '@ant-design/icons';
import * as R from 'ramda';
import dayjs from 'dayjs';
import {
  changeDataquery,
  changeFrequencyPeriod,
  changeLastNObservations,
} from '../../ducks/sdmx';
import { changeFilter } from '../../ducks/vis';
import { formatMessage } from '../../i18n';
import {
  getDataquery,
  getLastNMode,
  getLastNObservations,
} from '../../selectors/router';
import {
  getAvailableFrequencies,
  getDatesBoundaries,
  getDimensions,
  getFilters,
  getFrequency,
  getPeriod,
} from '../../selectors/sdmx';
import messages from '../messages';
import useSdmxStructure from '../../hooks/useSdmxStructure';

const { Panel } = Collapse;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface FiltersProps {
  classes?: any;
}

/**
 * Filters Component - Simplified version
 * Provides filtering controls for data visualization
 * Migrated to AntD + TypeScript
 */
const Filters: React.FC<FiltersProps> = ({ classes }) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  
  // Selectors
  const frequency = useSelector(getFrequency);
  const period = useSelector(getPeriod);
  const dimensions = useSelector(getDimensions);
  const filters = useSelector(getFilters);
  const availableFrequencies = useSelector(getAvailableFrequencies);
  const datesBoundaries = useSelector(getDatesBoundaries);
  const lastN = useSelector(getLastNObservations);
  const lastNMode = useSelector(getLastNMode);
  
  // Local state
  const [selectedFilters, setSelectedFilters] = useState<any>({});
  const [expandedPanels, setExpandedPanels] = useState<string[]>(['dimensions']);

  // Frequency options
  const frequencyOptions = availableFrequencies?.map((freq: any) => ({
    label: freq.label || freq.id,
    value: freq.id,
  })) || [];

  // Handle frequency change
  const handleFrequencyChange = (value: string) => {
    dispatch(changeFrequencyPeriod({ frequency: value }));
  };

  // Handle period change
  const handlePeriodChange = (dates: any) => {
    if (dates && dates[0] && dates[1]) {
      const startDate = dates[0].format('YYYY-MM-DD');
      const endDate = dates[1].format('YYYY-MM-DD');
      dispatch(changeFrequencyPeriod({ 
        period: { start: startDate, end: endDate } 
      }));
    }
  };

  // Handle dimension filter change
  const handleDimensionChange = (dimensionId: string, values: string[]) => {
    dispatch(changeFilter({ dimensionId, values }));
    setSelectedFilters({
      ...selectedFilters,
      [dimensionId]: values,
    });
  };

  // Handle last N observations change
  const handleLastNChange = (value: number) => {
    dispatch(changeLastNObservations(value));
  };

  // Count active filters
  const getActiveFilterCount = (dimensionId: string) => {
    const filterValues = filters?.[dimensionId];
    return filterValues?.length || 0;
  };

  return (
    <Card 
      title={
        <Space>
          <FilterOutlined />
          <Text strong>Filters</Text>
        </Space>
      }
      size="small"
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        
        {/* Frequency Selector */}
        {frequencyOptions.length > 0 && (
          <div>
            <Text type="secondary">Frequency</Text>
            <Select
              value={frequency}
              onChange={handleFrequencyChange}
              options={frequencyOptions}
              style={{ width: '100%', marginTop: 8 }}
              placeholder="Select frequency"
            />
          </div>
        )}

        {/* Period Selector */}
        <div>
          <Text type="secondary">Period</Text>
          <RangePicker
            style={{ width: '100%', marginTop: 8 }}
            format="YYYY-MM-DD"
            onChange={handlePeriodChange}
            placeholder={['Start Date', 'End Date']}
          />
        </div>

        {/* Last N Observations */}
        <div>
          <Text type="secondary">Last N Observations</Text>
          <Select
            value={lastN}
            onChange={handleLastNChange}
            style={{ width: '100%', marginTop: 8 }}
            options={[
              { label: 'All', value: 0 },
              { label: 'Last 5', value: 5 },
              { label: 'Last 10', value: 10 },
              { label: 'Last 20', value: 20 },
              { label: 'Last 50', value: 50 },
            ]}
          />
        </div>

        {/* Dimension Filters */}
        <Collapse 
          activeKey={expandedPanels}
          onChange={setExpandedPanels as any}
          ghost
        >
          <Panel 
            header={
              <Space>
                <Text strong>Dimensions</Text>
                <Badge count={Object.keys(selectedFilters).length} />
              </Space>
            } 
            key="dimensions"
          >
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              {dimensions?.map((dimension: any) => {
                const activeCount = getActiveFilterCount(dimension.id);
                return (
                  <div key={dimension.id}>
                    <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                      <Text>{dimension.label || dimension.id}</Text>
                      {activeCount > 0 && (
                        <Badge count={activeCount} style={{ backgroundColor: '#52c41a' }} />
                      )}
                    </Space>
                    <Select
                      mode="multiple"
                      value={selectedFilters[dimension.id] || []}
                      onChange={(values) => handleDimensionChange(dimension.id, values)}
                      style={{ width: '100%', marginTop: 4 }}
                      placeholder={`Select ${dimension.label || dimension.id}`}
                      options={dimension.values?.map((val: any) => ({
                        label: val.label || val.id,
                        value: val.id,
                      })) || []}
                      maxTagCount="responsive"
                    />
                  </div>
                );
              })}
            </Space>
          </Panel>
        </Collapse>

        {/* Clear All Filters */}
        <Button 
          type="text" 
          danger 
          onClick={() => {
            setSelectedFilters({});
            // Dispatch clear all filters action
          }}
          style={{ width: '100%' }}
        >
          Clear All Filters
        </Button>
      </Space>
    </Card>
  );
};

export default Filters;
