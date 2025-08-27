import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Dropdown, Button, Space, Typography, Divider, Avatar } from 'antd';
import { UserOutlined, LogoutOutlined, LoginOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useSelector } from 'react-redux';
import { FormattedMessage, formatMessage } from '../i18n';
import messages from './messages';
import { getUser } from '../selectors/app.js';

const { Text } = Typography;

/**
 * User Component - Simplified version without OIDC
 * Migrated to AntD
 * For demo purposes - shows mock user or login button
 */
const User: React.FC = () => {
  const intl = useIntl();
  const user = useSelector(getUser);
  const [mockLoggedIn, setMockLoggedIn] = useState(false);

  // Mock user for demo
  const mockUser = {
    given_name: 'Demo',
    family_name: 'User',
    email: 'demo@example.com',
  };

  const handleMockLogin = () => {
    setMockLoggedIn(true);
    // In real app, this would trigger auth flow
    console.log('Mock login - in production this would use real authentication');
  };

  const handleMockLogout = () => {
    setMockLoggedIn(false);
    // In real app, this would trigger logout
    console.log('Mock logout');
  };

  // If auth is disabled, show nothing or mock user
  if (!user && !mockLoggedIn) {
    return (
      <Button
        type="text"
        icon={<LoginOutlined />}
        onClick={handleMockLogin}
        aria-label={formatMessage(intl)(messages.userLogin)}
      >
        <FormattedMessage id="user.login" />
      </Button>
    );
  }

  const displayUser = user || mockUser;

  const items: MenuProps['items'] = [
    {
      key: 'user-info',
      label: (
        <Space direction="vertical" size="small">
          <Text strong>
            {displayUser.given_name} {displayUser.family_name}
          </Text>
          <Text type="secondary">{displayUser.email}</Text>
        </Space>
      ),
      disabled: true,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: <FormattedMessage id="user.logout" />,
      onClick: handleMockLogout,
    },
  ];

  return (
    <Dropdown menu={{ items }} placement="bottomRight" trigger={['click']}>
      <Button
        type="text"
        aria-label={formatMessage(intl)(messages.userLogin)}
      >
        <Avatar 
          size="small" 
          icon={<UserOutlined />}
          style={{ marginRight: 8 }}
        />
        <span>{displayUser.given_name}</span>
      </Button>
    </Dropdown>
  );
};

export default User;
