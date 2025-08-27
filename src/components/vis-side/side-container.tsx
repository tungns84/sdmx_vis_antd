import React, { useState } from 'react';
import { Drawer, Button, Badge } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { useIntl } from 'react-intl';
import { formatMessage } from '../../i18n';

interface NarrowFiltersProps {
  isNarrow?: boolean;
  isPopper?: boolean;
  popperLabels?: any;
  children?: React.ReactNode;
  isSearch?: boolean;
}

const messages = {
  label: { id: 'de.side.filters.action' },
  searchFiltersLabel: { id: 'de.side.filters.result' },
};

/**
 * NarrowFilters Component
 * Wrapper that shows filters in a drawer on mobile/narrow screens
 * Migrated to AntD + TypeScript
 */
const NarrowFilters: React.FC<NarrowFiltersProps> = ({
  isNarrow,
  isPopper,
  popperLabels,
  children,
  isSearch,
}) => {
  const intl = useIntl();
  const [drawerVisible, setDrawerVisible] = useState(false);

  // On narrow screens, show filters in a drawer
  if (isNarrow) {
    const label = isSearch
      ? formatMessage(intl)(messages.searchFiltersLabel)
      : formatMessage(intl)(messages.label);

    return (
      <>
        <Button
          type="primary"
          icon={<FilterOutlined />}
          onClick={() => setDrawerVisible(true)}
          style={{ marginBottom: 16 }}
        >
          {label}
          <Badge count={0} style={{ marginLeft: 8 }} />
        </Button>
        
        <Drawer
          title={label}
          placement="left"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          width={320}
          bodyStyle={{ padding: '16px' }}
        >
          {children}
        </Drawer>
      </>
    );
  }

  // On desktop, show filters directly
  return <>{children}</>;
};

export default NarrowFilters;
