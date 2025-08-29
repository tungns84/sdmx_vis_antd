/**
 * Label Selector Component
 * Following react rule: Keep components small and focused
 */

import React, { memo } from 'react';
import { Dropdown, Button, Space } from 'antd';
import type { MenuProps } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { FormattedMessage, useIntl } from 'react-intl';
import { LabelSelectorProps, DisplayMode } from '../../../types/toolbar.types';
import { TOOLBAR_ICONS, DISPLAY_MODES } from '../../../constants/toolbar.constants';

const TagsIcon = TOOLBAR_ICONS.ACTIONS.LABELS;

/**
 * Label Selector Component
 * Allows users to select how labels are displayed (Name, ID, or Both)
 */
export const LabelSelector: React.FC<LabelSelectorProps> = memo(({
  mode,
  onChange,
}) => {
  const intl = useIntl();
  const items: MenuProps['items'] = [
    {
      key: DISPLAY_MODES.NAME,
      icon: mode === DISPLAY_MODES.NAME ? <CheckOutlined /> : null,
      label: (
        <Space>
          <TOOLBAR_ICONS.DISPLAY.NAME />
          <FormattedMessage id="toolbar.display.name" defaultMessage="Names" />
        </Space>
      ),
      onClick: () => onChange(DISPLAY_MODES.NAME as DisplayMode),
    },
    {
      key: DISPLAY_MODES.ID,
      icon: mode === DISPLAY_MODES.ID ? <CheckOutlined /> : null,
      label: (
        <Space>
          <TOOLBAR_ICONS.DISPLAY.ID />
          <FormattedMessage id="toolbar.display.id" defaultMessage="Codes" />
        </Space>
      ),
      onClick: () => onChange(DISPLAY_MODES.ID as DisplayMode),
    },
    {
      key: DISPLAY_MODES.BOTH,
      icon: mode === DISPLAY_MODES.BOTH ? <CheckOutlined /> : null,
      label: (
        <Space>
          <TOOLBAR_ICONS.DISPLAY.BOTH />
          <FormattedMessage id="toolbar.display.both" defaultMessage="Both" />
        </Space>
      ),
      onClick: () => onChange(DISPLAY_MODES.BOTH as DisplayMode),
    },
  ];

  return (
    <Dropdown
      menu={{ items, selectedKeys: [mode] }}
      placement="bottomLeft"
      trigger={['click']}
    >
      <Button
        icon={<TagsIcon />}
        aria-label={intl.formatMessage({ id: 'toolbar.action.labels', defaultMessage: 'Select label display mode' })}
        data-testid="label-selector"
      >
        <FormattedMessage id="toolbar.action.labels" defaultMessage="Labels" />
      </Button>
    </Dropdown>
  );
});

LabelSelector.displayName = 'LabelSelector';
