/**
 * Table Toolbar Component with i18n support
 * Following clean-code and react best practices
 */

import React, { memo, useCallback } from 'react';
import { Space, Divider } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  SettingOutlined,
  ShareAltOutlined,
  ApiOutlined,
  SwapOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import { ToolbarProps } from '../../types/toolbar.types';
import { TOOLBAR_STYLES } from '../../constants/toolbar.constants';
import { useToolbar, useToolbarShortcuts } from '../../hooks/useToolbar';
import {
  ViewerSelector,
  LabelSelector,
  DownloadMenu,
  ToolbarButton,
} from './components';
import './TableToolbar.css';

/**
 * Table Toolbar Component with i18n
 * Provides controls for table viewing, customization, and data export
 */
const ToolbarWithI18n: React.FC<ToolbarProps> = memo(({
  viewerId,
  availableCharts = [],
  displayMode,
  actionId,
  isFullscreen,
  isLoading = false,
  hasMicrodata = false,
  hasRefAreaDimension = false,
  viewerProps,
  filtersVisible = false,
  onViewerChange,
  onDisplayModeChange,
  onActionChange,
  onFullscreenToggle,
  onFilterToggle,
  className = '',
  features = {},
}) => {
  const intl = useIntl();
  
  // Default features
  const {
    showViewerSelector = true,
    showLabelSelector = true,
    showCustomize = false,
    showLayout = true,
    showShare = true,
    showAPI = true,
    showDownload = true,
    showFullscreen = false,
    showFilters = false,
  } = features;

  // Custom hooks
  const {
    isActionActive,
    toggleAction,
    closeAllActions,
  } = useToolbar(actionId, onActionChange);

  useToolbarShortcuts({
    onFullscreenToggle,
    onDownload: () => toggleAction('download'),
    onShare: () => toggleAction('share'),
    onAPI: () => toggleAction('api'),
    onCustomize: () => toggleAction('config'),
  });

  // Handlers
  const handleActionClick = useCallback((action: string) => {
    if (action === 'filter' && onFilterToggle) {
      onFilterToggle();
    } else {
      toggleAction(action);
    }
  }, [toggleAction, onFilterToggle]);

  return (
    <div className={`sdmx-toolbar ${className}`}>
      <Space size={TOOLBAR_STYLES.BUTTON_GAP} align="center">
        {/* Viewer Selector */}
        {showViewerSelector && (
          <>
            <ViewerSelector
              viewerId={viewerId}
              availableCharts={availableCharts}
              onChange={onViewerChange}
              disabled={isLoading}
            />
            <Divider type="vertical" />
          </>
        )}

        {/* Label Display Mode */}
        {showLabelSelector && onDisplayModeChange && (
          <>
            <LabelSelector
              mode={displayMode}
              onChange={onDisplayModeChange}
              disabled={isLoading}
            />
            <Divider type="vertical" />
          </>
        )}

        {/* Action Buttons */}
        <Space size={TOOLBAR_STYLES.BUTTON_GAP}>
          {showLayout && (
            <ToolbarButton
              icon={<SwapOutlined />}
              tooltip={intl.formatMessage({ id: 'toolbar.action.config' })}
              active={isActionActive('config')}
              onClick={() => handleActionClick('config')}
              disabled={isLoading}
            />
          )}

          {showShare && (
            <ToolbarButton
              icon={<ShareAltOutlined />}
              tooltip={intl.formatMessage({ id: 'toolbar.action.share' })}
              active={isActionActive('share')}
              onClick={() => handleActionClick('share')}
              disabled={isLoading}
            />
          )}

          {showAPI && (
            <ToolbarButton
              icon={<ApiOutlined />}
              tooltip={intl.formatMessage({ id: 'toolbar.action.api' })}
              active={isActionActive('api')}
              onClick={() => handleActionClick('api')}
              disabled={isLoading}
            />
          )}

          {showDownload && (
            <DownloadMenu
              onDownload={(format) => {
                console.log('Download:', format);
                // TODO: Implement download logic
              }}
              disabled={isLoading}
            />
          )}

          {showFilters && (
            <ToolbarButton
              icon={<FilterOutlined />}
              tooltip={intl.formatMessage({ id: 'toolbar.action.filter' })}
              active={filtersVisible}
              onClick={() => handleActionClick('filter')}
              disabled={isLoading}
              badge={filtersVisible ? '•' : undefined}
            />
          )}
        </Space>
      </Space>
    </div>
  );
});

ToolbarWithI18n.displayName = 'ToolbarWithI18n';

export default ToolbarWithI18n;
