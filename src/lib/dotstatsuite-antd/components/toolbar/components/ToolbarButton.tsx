/**
 * Toolbar Button Component
 * Following react rule: Keep components small and focused
 */

import React, { memo } from 'react';
import { Button, Tooltip } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { ToolbarButtonProps } from '../../../types/toolbar.types';

/**
 * Toolbar Button Component
 * Renders a button with consistent styling for the toolbar
 */
export const ToolbarButton: React.FC<ToolbarButtonProps> = memo(({
  icon,
  label,
  tooltip,
  selected = false,
  disabled = false,
  loading = false,
  onClick,
  'aria-label': ariaLabel,
  'aria-pressed': ariaPressed,
  'aria-expanded': ariaExpanded,
  testId,
}) => {
  const button = (
    <Button
      type={selected ? 'primary' : 'default'}
      icon={loading ? <LoadingOutlined /> : icon}
      disabled={disabled || loading}
      onClick={onClick}
      aria-label={ariaLabel || label}
      aria-pressed={ariaPressed ?? selected}
      aria-expanded={ariaExpanded}
      data-testid={testId}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {label}
    </Button>
  );

  if (tooltip) {
    return (
      <Tooltip title={tooltip} placement="bottom">
        {button}
      </Tooltip>
    );
  }

  return button;
});

ToolbarButton.displayName = 'ToolbarButton';
