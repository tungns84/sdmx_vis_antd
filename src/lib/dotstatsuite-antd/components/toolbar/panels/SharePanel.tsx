/**
 * Share Panel Component
 * Following react rule: Keep components small and focused
 */

import React, { memo, useState, useCallback } from 'react';
import { Card, Space, Button, Input, Typography, message, Tabs, QRCode } from 'antd';
import { CopyOutlined, CloseOutlined, LinkOutlined, QrcodeOutlined, CodeOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface SharePanelProps {
  url?: string;
  embedCode?: string;
  onClose: () => void;
}

/**
 * Share Panel Component
 * Provides options to share the current view
 */
export const SharePanel: React.FC<SharePanelProps> = memo(({
  url = window.location.href,
  embedCode,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState('link');

  // Generate embed code if not provided
  const defaultEmbedCode = embedCode || `<iframe
  src="${url}"
  width="100%"
  height="600"
  frameborder="0"
  allowfullscreen
></iframe>`;

  // Copy to clipboard handler
  const handleCopy = useCallback((text: string, type: string) => {
    navigator.clipboard.writeText(text)
      .then(() => message.success(`${type} copied to clipboard`))
      .catch(() => message.error('Failed to copy'));
  }, []);

  const tabItems = [
    {
      key: 'link',
      label: (
        <Space>
          <LinkOutlined />
          Link
        </Space>
      ),
      children: (
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text type="secondary">Share this link:</Text>
          <Input.Group compact>
            <Input
              value={url}
              readOnly
              style={{ width: 'calc(100% - 32px)' }}
            />
            <Button
              icon={<CopyOutlined />}
              onClick={() => handleCopy(url, 'Link')}
            />
          </Input.Group>
        </Space>
      ),
    },
    {
      key: 'qr',
      label: (
        <Space>
          <QrcodeOutlined />
          QR Code
        </Space>
      ),
      children: (
        <Space direction="vertical" style={{ width: '100%' }} align="center">
          <Text type="secondary">Scan to access this view:</Text>
          <QRCode value={url} size={200} />
          <Button
            onClick={() => {
              const canvas = document.querySelector<HTMLCanvasElement>('canvas');
              if (canvas) {
                canvas.toBlob((blob) => {
                  if (blob) {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'qrcode.png';
                    a.click();
                    URL.revokeObjectURL(url);
                    message.success('QR code downloaded');
                  }
                });
              }
            }}
          >
            Download QR Code
          </Button>
        </Space>
      ),
    },
    {
      key: 'embed',
      label: (
        <Space>
          <CodeOutlined />
          Embed
        </Space>
      ),
      children: (
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text type="secondary">Embed code for websites:</Text>
          <TextArea
            value={defaultEmbedCode}
            readOnly
            rows={6}
            style={{ fontFamily: 'monospace' }}
          />
          <Button
            icon={<CopyOutlined />}
            onClick={() => handleCopy(defaultEmbedCode, 'Embed code')}
          >
            Copy Embed Code
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card
      className="share-panel"
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
          🔗 Share This View
        </Title>
        
        <Button
          icon={<CloseOutlined />}
          onClick={onClose}
          type="text"
        />
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
      />

      <div style={{ marginTop: 16 }}>
        <Text type="secondary">
          Note: Anyone with this link can view the current table configuration.
        </Text>
      </div>
    </Card>
  );
});

SharePanel.displayName = 'SharePanel';
