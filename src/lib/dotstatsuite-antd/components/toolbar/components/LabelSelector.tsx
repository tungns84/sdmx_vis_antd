/**
 * Label Selector Component
 * Following react rule: Keep components small and focused
 */

import React, { memo } from 'react';
import { Dropdown, Button, Space } from 'antd';
import type { MenuProps } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { LabelSelectorProps, DisplayMode } from '../../../types/toolbar.types';
import { TOOLBAR_ICONS, TOOLBAR_LABELS, DISPLAY_MODES } from '../../../constants/toolbar.constants';

const TagsIcon = TOOLBAR_ICONS.ACTIONS.LABELS;

/**
 * Label Selector Component
 * Allows users to select how labels are displayed (Name, ID, or Both)
 */
export const LabelSelector: React.FC<LabelSelectorProps> = memo(({
  mode,
  onChange,
}) => {
  const items: MenuProps['items'] = [
    {
      key: DISPLAY_MODES.NAME,
      icon: mode === DISPLAY_MODES.NAME ? <CheckOutlined /> : null,
      label: (
        <Space>
          <TOOLBAR_ICONS.DISPLAY.NAME />
          {TOOLBAR_LABELS.DISPLAY_MODES.NAME}
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
          {TOOLBAR_LABELS.DISPLAY_MODES.ID}
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
          {TOOLBAR_LABELS.DISPLAY_MODES.BOTH}
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
        aria-label="Select label display mode"
        data-testid="label-selector"
      >
        {TOOLBAR_LABELS.ACTIONS.LABELS}
      </Button>
    </Dropdown>
  );
});

LabelSelector.displayName = 'LabelSelector';
