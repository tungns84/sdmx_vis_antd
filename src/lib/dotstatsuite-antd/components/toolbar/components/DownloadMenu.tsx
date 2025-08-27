/**
 * Download Menu Component
 * Following react rule: Keep components small and focused
 */

import React, { memo, useState } from 'react';
import { Dropdown, Button, Spin, message } from 'antd';
import type { MenuProps } from 'antd';
import { DownloadOutlined, LoadingOutlined } from '@ant-design/icons';
import { ViewerType } from '../../../types/toolbar.types';
import { TOOLBAR_ICONS, TOOLBAR_LABELS, VIEWER_TYPES, DOWNLOAD_FORMATS } from '../../../constants/toolbar.constants';
import { useDownloadOptions } from '../../../hooks/useToolbar';

interface DownloadMenuProps {
  viewerType: ViewerType;
  isLoading?: boolean;
  onDownload: (format: string) => Promise<void>;
}

/**
 * Download Menu Component
 * Provides download options based on the current viewer type
 */
export const DownloadMenu: React.FC<DownloadMenuProps> = memo(({
  viewerType,
  isLoading = false,
  onDownload,
}) => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async (format: string) => {
    setDownloading(true);
    try {
      await onDownload(format);
      message.success(`Successfully downloaded ${format.toUpperCase()} file`);
    } catch (error) {
      message.error(`Failed to download: ${error}`);
    } finally {
      setDownloading(false);
    }
  };

  // Get download options based on viewer type
  const getMenuItems = (): MenuProps['items'] => {
    const items: MenuProps['items'] = [];

    // Table downloads
    if (viewerType === VIEWER_TYPES.TABLE) {
      items.push(
        {
          key: 'excel-selection',
          icon: <TOOLBAR_ICONS.FORMATS.EXCEL />,
          label: TOOLBAR_LABELS.DOWNLOADS.EXCEL_SELECTION,
          onClick: () => handleDownload(DOWNLOAD_FORMATS.EXCEL),
        },
        {
          key: 'excel-all',
          icon: <TOOLBAR_ICONS.FORMATS.EXCEL />,
          label: TOOLBAR_LABELS.DOWNLOADS.EXCEL_ALL,
          onClick: () => handleDownload(`${DOWNLOAD_FORMATS.EXCEL}-all`),
        },
        { type: 'divider' },
        {
          key: 'csv-selection',
          icon: <TOOLBAR_ICONS.FORMATS.CSV />,
          label: TOOLBAR_LABELS.DOWNLOADS.CSV_SELECTION,
          onClick: () => handleDownload(DOWNLOAD_FORMATS.CSV),
        },
        {
          key: 'csv-all',
          icon: <TOOLBAR_ICONS.FORMATS.CSV />,
          label: TOOLBAR_LABELS.DOWNLOADS.CSV_ALL,
          onClick: () => handleDownload(`${DOWNLOAD_FORMATS.CSV}-all`),
        },
        { type: 'divider' },
        {
          key: 'json',
          icon: <TOOLBAR_ICONS.FORMATS.JSON />,
          label: TOOLBAR_LABELS.DOWNLOADS.JSON,
          onClick: () => handleDownload(DOWNLOAD_FORMATS.JSON),
        },
      );
    }

    // Chart downloads
    if (viewerType === VIEWER_TYPES.CHART) {
      items.push(
        {
          key: 'png',
          icon: <TOOLBAR_ICONS.FORMATS.PNG />,
          label: TOOLBAR_LABELS.DOWNLOADS.PNG,
          onClick: () => handleDownload(DOWNLOAD_FORMATS.PNG),
        },
        {
          key: 'svg',
          icon: <TOOLBAR_ICONS.FORMATS.PNG />,
          label: TOOLBAR_LABELS.DOWNLOADS.SVG,
          onClick: () => handleDownload(DOWNLOAD_FORMATS.SVG),
        },
        { type: 'divider' },
        {
          key: 'pdf',
          icon: <TOOLBAR_ICONS.FORMATS.PDF />,
          label: 'PDF Document',
          onClick: () => handleDownload('pdf'),
        },
      );
    }

    // Overview downloads
    if (viewerType === VIEWER_TYPES.OVERVIEW) {
      items.push(
        {
          key: 'pdf-report',
          icon: <TOOLBAR_ICONS.FORMATS.PDF />,
          label: 'PDF Report',
          onClick: () => handleDownload('pdf-report'),
        },
      );
    }

    return items;
  };

  const loading = isLoading || downloading;

  return (
    <Dropdown
      menu={{ items: getMenuItems() }}
      placement="bottomLeft"
      trigger={['click']}
      disabled={loading}
    >
      <Button
        icon={loading ? <LoadingOutlined /> : <DownloadOutlined />}
        loading={loading}
        aria-label="Download options"
        data-testid="download-menu"
      >
        {TOOLBAR_LABELS.ACTIONS.DOWNLOAD}
      </Button>
    </Dropdown>
  );
});

DownloadMenu.displayName = 'DownloadMenu';
