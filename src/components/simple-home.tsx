import React from 'react';
import { Card, Typography, Space, Button, Row, Col } from 'antd';
import { 
  BarChartOutlined, 
  TableOutlined, 
  FileExcelOutlined,
  DatabaseOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

/**
 * Simple Home Page for the converted version
 * Replaces the search functionality with direct navigation
 */
const SimpleHome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Title level={1}>SDMX Data Visualization</Title>
          <Paragraph>
            Explore and visualize SDMX data with interactive charts and tables
          </Paragraph>
        </div>

        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} lg={6}>
            <Card 
              hoverable
              onClick={() => navigate('/vis')}
              style={{ height: '100%' }}
            >
              <Space direction="vertical" align="center" style={{ width: '100%' }}>
                <BarChartOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                <Title level={4}>Visualizations</Title>
                <Paragraph>
                  View data with interactive charts and graphs
                </Paragraph>
              </Space>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card 
              hoverable
              onClick={() => navigate('/vis?view=table')}
              style={{ height: '100%' }}
            >
              <Space direction="vertical" align="center" style={{ width: '100%' }}>
                <TableOutlined style={{ fontSize: '48px', color: '#52c41a' }} />
                <Title level={4}>Data Tables</Title>
                <Paragraph>
                  Browse data in tabular format
                </Paragraph>
              </Space>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card 
              hoverable
              style={{ height: '100%' }}
            >
              <Space direction="vertical" align="center" style={{ width: '100%' }}>
                <FileExcelOutlined style={{ fontSize: '48px', color: '#fa8c16' }} />
                <Title level={4}>Export Data</Title>
                <Paragraph>
                  Download data in various formats
                </Paragraph>
              </Space>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card 
              hoverable
              onClick={() => navigate('/ts-demo')}
              style={{ height: '100%' }}
            >
              <Space direction="vertical" align="center" style={{ width: '100%' }}>
                <DatabaseOutlined style={{ fontSize: '48px', color: '#722ed1' }} />
                <Title level={4}>Demo Data</Title>
                <Paragraph>
                  View sample SDMX data demonstration
                </Paragraph>
              </Space>
            </Card>
          </Col>
        </Row>

        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <Space>
            <Button type="primary" size="large" onClick={() => navigate('/vis')}>
              Start Exploring
            </Button>
            <Button size="large" onClick={() => navigate('/phase2-test')}>
              Component Tests
            </Button>
          </Space>
        </div>
      </Space>
    </div>
  );
};

export default SimpleHome;
