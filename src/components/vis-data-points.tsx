import React from 'react';
import { useSelector } from 'react-redux';
import { Card, Statistic, Row, Col, Space, Typography } from 'antd';
import { DatabaseOutlined, TableOutlined, CalendarOutlined } from '@ant-design/icons';
import { getData } from '../selectors/sdmx';
import { getFrequency, getPeriod } from '../selectors/sdmx';

const { Text } = Typography;

/**
 * VisDataPoints Component
 * Shows summary statistics about the current data
 * Migrated to AntD + TypeScript
 */
const VisDataPoints: React.FC = () => {
  const data = useSelector(getData);
  const frequency = useSelector(getFrequency);
  const period = useSelector(getPeriod);

  // Calculate statistics
  const stats = React.useMemo(() => {
    if (!data) {
      return {
        totalObservations: 0,
        totalSeries: 0,
        periodRange: 'N/A',
        frequency: frequency || 'N/A',
      };
    }

    // These would be calculated from actual data structure
    return {
      totalObservations: data?.observations?.length || 0,
      totalSeries: data?.series?.length || 0,
      periodRange: period ? `${period.start} - ${period.end}` : 'All periods',
      frequency: frequency || 'All frequencies',
    };
  }, [data, frequency, period]);

  return (
    <Card size="small" className="vis-data-points">
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={6}>
          <Statistic
            title="Observations"
            value={stats.totalObservations}
            prefix={<DatabaseOutlined />}
            valueStyle={{ fontSize: '16px' }}
          />
        </Col>
        
        <Col xs={12} sm={6}>
          <Statistic
            title="Series"
            value={stats.totalSeries}
            prefix={<TableOutlined />}
            valueStyle={{ fontSize: '16px' }}
          />
        </Col>
        
        <Col xs={12} sm={6}>
          <Space direction="vertical" size="small">
            <Text type="secondary">Frequency</Text>
            <Text strong>{stats.frequency}</Text>
          </Space>
        </Col>
        
        <Col xs={12} sm={6}>
          <Space direction="vertical" size="small">
            <Text type="secondary">Period</Text>
            <Space size="small">
              <CalendarOutlined />
              <Text strong>{stats.periodRange}</Text>
            </Space>
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

export default VisDataPoints;
