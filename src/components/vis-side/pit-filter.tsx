import React, { useState } from 'react';
import { Card, DatePicker, Space, Typography, Switch } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';

const { Text } = Typography;

/**
 * PiTFilter Component (Point in Time Filter)
 * Allows filtering data to a specific point in time
 * Migrated to AntD + TypeScript
 */
const PiTFilter: React.FC = () => {
  const dispatch = useDispatch();
  const [enabled, setEnabled] = useState(false);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);

  const handleToggle = (checked: boolean) => {
    setEnabled(checked);
    if (!checked) {
      setSelectedDate(null);
      // Dispatch action to clear PiT filter
    }
  };

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    setSelectedDate(date);
    if (date) {
      // Dispatch action to set PiT filter
      console.log('Set Point in Time filter:', date.format('YYYY-MM-DD'));
    }
  };

  return (
    <Card size="small">
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        <Space align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
          <Space>
            <CalendarOutlined />
            <Text>Point in Time Filter</Text>
          </Space>
          <Switch
            checked={enabled}
            onChange={handleToggle}
            size="small"
          />
        </Space>
        
        {enabled && (
          <DatePicker
            value={selectedDate}
            onChange={handleDateChange}
            style={{ width: '100%' }}
            placeholder="Select date"
            format="YYYY-MM-DD"
          />
        )}
      </Space>
    </Card>
  );
};

export default PiTFilter;
