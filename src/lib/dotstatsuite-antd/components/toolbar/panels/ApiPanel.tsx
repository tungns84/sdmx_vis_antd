/**
 * API Panel Component
 * Following react rule: Keep components small and focused
 */

import React, { memo, useState } from 'react';
import { Card, Space, Button, Typography, notification, Tabs, Input, Select, Tag } from 'antd';
import { CopyOutlined, CloseOutlined, ApiOutlined, CodeOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface ApiPanelProps {
  dataUrl?: string;
  metadataUrl?: string;
  onClose: () => void;
}

/**
 * API Panel Component
 * Provides API endpoint information and query examples
 */
export const ApiPanel: React.FC<ApiPanelProps> = memo(({
  dataUrl = '/api/data/v1/sdmx',
  metadataUrl = '/api/metadata/v1/sdmx',
  onClose,
}) => {
  const [format, setFormat] = useState('json');
  const [queryType, setQueryType] = useState('data');

  // Generate example queries
  const generateQuery = () => {
    const base = queryType === 'data' ? dataUrl : metadataUrl;
    const params = new URLSearchParams({
      format,
      startPeriod: '2020',
      endPeriod: '2023',
      dimensionAtObservation: 'TIME_PERIOD',
    });
    return `${base}?${params.toString()}`;
  };

  // Copy to clipboard handler
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        notification.success({
          message: 'Copied!',
          description: 'API query copied to clipboard',
          placement: 'bottomRight',
          duration: 2,
          icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />
        });
      })
      .catch(() => {
        notification.error({
          message: 'Copy Failed',
          description: 'Failed to copy to clipboard',
          placement: 'bottomRight',
          duration: 3,
          icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
        });
      });
  };

  // Example code snippets
  const codeExamples = {
    javascript: `// JavaScript Example
fetch('${generateQuery()}')
  .then(response => response.json())
  .then(data => {
    console.log('SDMX Data:', data);
  })
  .catch(error => {
    console.error('Error:', error);
  });`,
    python: `# Python Example
import requests

response = requests.get('${generateQuery()}')
data = response.json()
print('SDMX Data:', data)`,
    curl: `# cURL Example
curl -X GET "${generateQuery()}" \\
  -H "Accept: application/json"`,
  };

  const tabItems = [
    {
      key: 'endpoints',
      label: (
        <Space>
          <ApiOutlined />
          Endpoints
        </Space>
      ),
      children: (
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <Text strong>Data Endpoint:</Text>
            <Input.Group compact style={{ marginTop: 8 }}>
              <Input
                value={dataUrl}
                readOnly
                style={{ width: 'calc(100% - 32px)' }}
              />
              <Button
                icon={<CopyOutlined />}
                onClick={() => handleCopy(dataUrl)}
              />
            </Input.Group>
          </div>
          
          <div>
            <Text strong>Metadata Endpoint:</Text>
            <Input.Group compact style={{ marginTop: 8 }}>
              <Input
                value={metadataUrl}
                readOnly
                style={{ width: 'calc(100% - 32px)' }}
              />
              <Button
                icon={<CopyOutlined />}
                onClick={() => handleCopy(metadataUrl)}
              />
            </Input.Group>
          </div>

          <div style={{ marginTop: 16 }}>
            <Text type="secondary">Supported Formats:</Text>
            <div style={{ marginTop: 8 }}>
              <Tag color="blue">JSON</Tag>
              <Tag color="green">XML</Tag>
              <Tag color="orange">CSV</Tag>
              <Tag color="purple">SDMX-ML</Tag>
            </div>
          </div>
        </Space>
      ),
    },
    {
      key: 'query',
      label: (
        <Space>
          <CodeOutlined />
          Query Builder
        </Space>
      ),
      children: (
        <Space direction="vertical" style={{ width: '100%' }}>
          <Space>
            <Text>Type:</Text>
            <Select
              value={queryType}
              onChange={setQueryType}
              style={{ width: 120 }}
              options={[
                { value: 'data', label: 'Data' },
                { value: 'metadata', label: 'Metadata' },
              ]}
            />
            <Text>Format:</Text>
            <Select
              value={format}
              onChange={setFormat}
              style={{ width: 120 }}
              options={[
                { value: 'json', label: 'JSON' },
                { value: 'xml', label: 'XML' },
                { value: 'csv', label: 'CSV' },
              ]}
            />
          </Space>

          <div>
            <Text type="secondary">Generated Query:</Text>
            <Input.Group compact style={{ marginTop: 8 }}>
              <TextArea
                value={generateQuery()}
                readOnly
                rows={3}
                style={{ width: 'calc(100% - 32px)', fontFamily: 'monospace' }}
              />
              <Button
                icon={<CopyOutlined />}
                onClick={() => handleCopy(generateQuery())}
                style={{ height: 'auto' }}
              />
            </Input.Group>
          </div>

          <div style={{ marginTop: 16 }}>
            <Text type="secondary">Query Parameters:</Text>
            <ul style={{ marginTop: 8 }}>
              <li><code>format</code> - Response format (json, xml, csv)</li>
              <li><code>startPeriod</code> - Start period for time series</li>
              <li><code>endPeriod</code> - End period for time series</li>
              <li><code>dimensionAtObservation</code> - Observation dimension</li>
              <li><code>detail</code> - Level of detail (full, dataonly, serieskeysonly)</li>
            </ul>
          </div>
        </Space>
      ),
    },
    {
      key: 'examples',
      label: (
        <Space>
          <CodeOutlined />
          Code Examples
        </Space>
      ),
      children: (
        <Tabs
          tabPosition="left"
          items={Object.entries(codeExamples).map(([lang, code]) => ({
            key: lang,
            label: lang.charAt(0).toUpperCase() + lang.slice(1),
            children: (
              <div>
                <TextArea
                  value={code}
                  readOnly
                  rows={10}
                  style={{ fontFamily: 'monospace', fontSize: 12 }}
                />
                <Button
                  icon={<CopyOutlined />}
                  onClick={() => handleCopy(code)}
                  style={{ marginTop: 8 }}
                >
                  Copy Code
                </Button>
              </div>
            ),
          }))}
        />
      ),
    },
  ];

  return (
    <Card
      className="api-panel"
      style={{ 
        marginTop: 16,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      }}
    >
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
      }}>
        <Title level={4} style={{ margin: 0 }}>
          🔌 API Queries
        </Title>
        
        <Button
          icon={<CloseOutlined />}
          onClick={onClose}
          type="text"
        />
      </div>

      <Tabs items={tabItems} />

      <div style={{ marginTop: 16 }}>
        <Text type="secondary">
          For full API documentation, visit{' '}
          <a href="/api/docs" target="_blank" rel="noopener noreferrer">
            /api/docs
          </a>
        </Text>
      </div>
    </Card>
  );
});

ApiPanel.displayName = 'ApiPanel';
