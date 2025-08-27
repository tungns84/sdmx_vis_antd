import React from 'react';
import { Card, Switch, Space, Typography } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage } from '../../i18n';
import { getHasDataAvailability } from '../../selectors/router';

const { Text } = Typography;

/**
 * DataAvailability Component
 * Toggle for showing only available data
 * Migrated to AntD + TypeScript
 */
const DataAvailability: React.FC = () => {
  const dispatch = useDispatch();
  const hasDataAvailability = useSelector(getHasDataAvailability);

  const handleChange = (checked: boolean) => {
    // Dispatch action to toggle data availability
    console.log('Toggle data availability:', checked);
  };

  return (
    <Card size="small">
      <Space align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
        <Space>
          <CheckCircleOutlined style={{ color: '#52c41a' }} />
          <Text>Show Available Data Only</Text>
        </Space>
        <Switch
          checked={hasDataAvailability}
          onChange={handleChange}
        />
      </Space>
    </Card>
  );
};

export default DataAvailability;
