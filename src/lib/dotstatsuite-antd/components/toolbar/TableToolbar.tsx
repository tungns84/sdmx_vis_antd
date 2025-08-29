/**
 * Table Toolbar Component
 * Following clean-code and react best practices
 */

import React, { memo, useCallback } from 'react';
import { Space, Divider } from 'antd';
import { useIntl, FormattedMessage } from 'react-intl';
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
 * Table Toolbar Component
 * Provides controls for table viewing, customization, and data export
 */
const TableToolbar: React.FC<ToolbarProps> = memo(({
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
    showOverview = true,
    showTable = true,
    showMicrodata = hasMicrodata,
    showCharts = availableCharts.length > 0,
    showLabels = true,
    showCustomize = true,
    showShare = true,
    showDownload = true,
    showApi = true,
    showFilters = true,
    showFullscreen = true,
  } = features;

  // Determine if table view is active
  const isTableView = viewerId === 'table';

  // Download handler
  const handleDownload = useCallback(async (format: string) => {
    console.log('Download:', format);
    // Implement actual download logic here
    return Promise.resolve();
  }, []);

  // Setup keyboard shortcuts
  useToolbarShortcuts({
    onFullscreen: showFullscreen ? onFullscreenToggle : undefined,
    onDownload: showDownload ? () => onActionChange('download') : undefined,
    onShare: showShare ? () => onActionChange('share') : undefined,
    onApi: showApi ? () => onActionChange('api') : undefined,
    onCustomize: showCustomize ? () => onActionChange('config') : undefined,
  });

  return (
    <div 
      className={`table-toolbar ${className}`}
      style={{ 
        minHeight: TOOLBAR_STYLES.HEIGHT,
        padding: '0 16px',
        background: '#fff',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
      role="toolbar"
      aria-label="Table toolbar"
    >
      {/* Left Section: View Controls */}
      <Space size={TOOLBAR_STYLES.BUTTON_GAP}>
        {(showOverview || showTable || showMicrodata || showCharts) && (
          <ViewerSelector
            currentViewer={viewerId}
            availableCharts={showCharts ? availableCharts : []}
            hasMicrodata={showMicrodata}
            onViewerChange={onViewerChange}
          />
        )}
      </Space>

      {/* Right Section: Action Controls */}
      <Space size={TOOLBAR_STYLES.BUTTON_GAP}>
        {/* Label Display Selector */}
        {showLabels && (
          <LabelSelector
            mode={displayMode}
            onChange={onDisplayModeChange}
          />
        )}

        {/* Filter Toggle Button */}
        {showFilters && onFilterToggle && (
          <ToolbarButton
            icon={<FilterOutlined />}
            label={intl.formatMessage({ id: 'toolbar.action.filter', defaultMessage: 'Filter' })}
            tooltip={intl.formatMessage({ id: 'toolbar.action.filter', defaultMessage: 'Filter' })}
            selected={filtersVisible}
            onClick={onFilterToggle}
            aria-expanded={filtersVisible}
            testId="toolbar-filters"
          />
        )}

        {/* Customize/Layout Button */}
        {showCustomize && (
          <ToolbarButton
            icon={isTableView ? <SwapOutlined /> : <SettingOutlined />}
            label={intl.formatMessage({ id: 'toolbar.action.config', defaultMessage: 'Configure' })}
            tooltip={intl.formatMessage({ id: 'toolbar.action.config', defaultMessage: 'Configure' })}
            selected={actionId === 'config'}
            onClick={() => onActionChange('config')}
            aria-expanded={actionId === 'config'}
            testId="toolbar-customize"
          />
        )}

        {/* Share Button */}
        {showShare && (
          <ToolbarButton
            icon={<ShareAltOutlined />}
            label={intl.formatMessage({ id: 'toolbar.action.share', defaultMessage: 'Share' })}
            tooltip={intl.formatMessage({ id: 'toolbar.action.share', defaultMessage: 'Share' })}
            selected={actionId === 'share'}
            onClick={() => onActionChange('share')}
            aria-expanded={actionId === 'share'}
            testId="toolbar-share"
          />
        )}

        {/* Download Menu */}
        {showDownload && (
          <DownloadMenu
            viewerType={viewerId}
            isLoading={isLoading}
            onDownload={handleDownload}
          />
        )}

        {/* API Queries Button */}
        {showApi && (
          <ToolbarButton
            icon={<ApiOutlined />}
            label={intl.formatMessage({ id: 'toolbar.action.api', defaultMessage: 'API' })}
            tooltip={intl.formatMessage({ id: 'toolbar.action.api', defaultMessage: 'API' })}
            selected={actionId === 'api'}
            onClick={() => onActionChange('api')}
            aria-expanded={actionId === 'api'}
            testId="toolbar-api"
          />
        )}

        {/* Divider */}
        {showFullscreen && <Divider type="vertical" />}

        {/* Fullscreen Button */}
        {showFullscreen && (
          <ToolbarButton
            icon={isFullscreen ? 
              <TOOLBAR_ICONS.ACTIONS.FULLSCREEN_EXIT /> : 
              <TOOLBAR_ICONS.ACTIONS.FULLSCREEN />
            }
            label={intl.formatMessage({ id: 'toolbar.action.fullscreen', defaultMessage: 'Fullscreen' })}
            tooltip={intl.formatMessage({ id: 'toolbar.action.fullscreen', defaultMessage: 'Fullscreen' })}
            selected={isFullscreen}
            onClick={onFullscreenToggle}
            aria-pressed={isFullscreen}
            testId="toolbar-fullscreen"
          />
        )}
      </Space>
    </div>
  );
});

// Import icons from constants (fix for the above code)
import { TOOLBAR_ICONS } from '../../constants/toolbar.constants';

TableToolbar.displayName = 'TableToolbar';

export default TableToolbar;
