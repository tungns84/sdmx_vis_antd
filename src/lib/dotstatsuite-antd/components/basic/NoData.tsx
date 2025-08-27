import React from 'react';
import { Empty } from 'antd';

interface NoDataProps {
  message?: string;
  description?: string;
  image?: 'default' | 'simple';
  children?: React.ReactNode;
}

const NoData: React.FC<NoDataProps> = ({ 
  message = 'No Data', 
  description,
  image = 'default',
  children
}) => {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '40px 20px',
      minHeight: '200px'
    }}>
      <Empty
        image={image === 'simple' ? Empty.PRESENTED_IMAGE_SIMPLE : Empty.PRESENTED_IMAGE_DEFAULT}
        description={
          <div>
            <div style={{ fontSize: '16px', fontWeight: 500, marginBottom: description ? '8px' : 0 }}>
              {message}
            </div>
            {description && (
              <div style={{ fontSize: '14px', color: '#999' }}>
                {description}
              </div>
            )}
          </div>
        }
      >
        {children}
      </Empty>
    </div>
  );
};

export default NoData;
