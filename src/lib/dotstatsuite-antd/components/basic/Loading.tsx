import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

interface LoadingProps {
  message?: string;
  size?: 'small' | 'default' | 'large';
  spinning?: boolean;
  delay?: number;
}

const Loading: React.FC<LoadingProps> = ({ 
  message = 'Loading...', 
  size = 'default',
  spinning = true,
  delay
}) => {
  const antIcon = <LoadingOutlined style={{ fontSize: size === 'large' ? 48 : 24 }} spin />;
  
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px',
      minHeight: '200px'
    }}>
      <Spin 
        indicator={antIcon} 
        size={size}
        spinning={spinning}
        delay={delay}
      />
      {message && (
        <div style={{ marginTop: '16px', color: '#666' }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default Loading;
