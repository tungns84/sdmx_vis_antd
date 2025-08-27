import React from 'react';
import { Result, Space } from 'antd';
import { theme } from 'antd';
import Page from './Page';

const NotFound: React.FC = () => {
  const { token } = theme.useToken();

  return (
    <Page id="notFound">
      <Space 
        direction="vertical" 
        style={{ 
          width: '100%',
          padding: token.paddingLG * 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh'
        }}
      >
        <Result
          status="404"
          title="404"
          subTitle="Page not found"
        />
      </Space>
    </Page>
  );
};

export default NotFound;
