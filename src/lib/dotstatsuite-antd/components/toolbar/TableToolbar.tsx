/**
 * Table Toolbar Component
 * Following clean-code and react best practices
 */

import React, { memo, useCallback } from 'react';
import { Space, Divider } from 'antd';
import {
  SettingOutlined,
  ShareAltOutlined,
  ApiOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import { ToolbarProps } from '../../types/toolbar.types';
import { TOOLBAR_LABELS, TOOLBAR_STYLES } from '../../constants/toolbar.constants';
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
  onViewerChange,
  onDisplayModeChange,
  onActionChange,
  onFullscreenToggle,
  className = '',
  features = {},
}) => {
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

        {/* Customize/Layout Button */}
        {showCustomize && (
          <ToolbarButton
            icon={isTableView ? <SwapOutlined /> : <SettingOutlined />}
            label={isTableView ? TOOLBAR_LABELS.ACTIONS.LAYOUT : TOOLBAR_LABELS.ACTIONS.CUSTOMIZE}
            tooltip={`${isTableView ? 'Change table layout' : 'Customize view'} (Ctrl+K)`}
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
            label={TOOLBAR_LABELS.ACTIONS.SHARE}
            tooltip="Share this view (Ctrl+S)"
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
            label={TOOLBAR_LABELS.ACTIONS.API}
            tooltip="View API queries (Ctrl+A)"
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
            label={isFullscreen ? 
              TOOLBAR_LABELS.ACTIONS.EXIT_FULLSCREEN : 
              TOOLBAR_LABELS.ACTIONS.FULLSCREEN
            }
            tooltip="Toggle fullscreen (F11)"
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
