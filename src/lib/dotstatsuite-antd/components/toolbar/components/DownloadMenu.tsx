/**
 * Download Menu Component
 * Following react rule: Keep components small and focused
 */

import React, { memo, useState } from 'react';
import { Dropdown, Button, Spin, notification } from 'antd';
import type { MenuProps } from 'antd';
import { DownloadOutlined, LoadingOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { FormattedMessage, useIntl } from 'react-intl';
import { ViewerType } from '../../../types/toolbar.types';
import { TOOLBAR_ICONS, VIEWER_TYPES, DOWNLOAD_FORMATS } from '../../../constants/toolbar.constants';
import { useDownloadOptions } from '../../../hooks/useToolbar';

interface DownloadMenuProps {
  viewerType?: ViewerType;
  isLoading?: boolean;
  onDownload: (format: string) => Promise<void> | void;
  disabled?: boolean;
}

/**
 * Download Menu Component
 * Provides download options based on the current viewer type
 */
export const DownloadMenu: React.FC<DownloadMenuProps> = memo(({
  viewerType = VIEWER_TYPES.TABLE,
  isLoading = false,
  onDownload,
  disabled = false,
}) => {
  const intl = useIntl();
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async (format: string) => {
    setDownloading(true);
    try {
      await onDownload(format);
      notification.success({
        message: intl.formatMessage({ id: 'message.success', defaultMessage: 'Success' }),
        description: intl.formatMessage({ id: 'message.downloadStarted', defaultMessage: 'Download started' }),
        placement: 'bottomRight',
        duration: 3,
        icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />
      });
    } catch (error) {
      notification.error({
        message: intl.formatMessage({ id: 'message.error', defaultMessage: 'Error' }),
        description: intl.formatMessage({ id: 'message.downloadFailed', defaultMessage: 'Download failed. Please try again.' }),
        placement: 'bottomRight',
        duration: 4,
        icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
      });
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
          label: intl.formatMessage({ id: 'download.excel.selection', defaultMessage: 'Excel (Selection)' }),
          onClick: () => handleDownload(DOWNLOAD_FORMATS.EXCEL),
        },
        {
          key: 'excel-all',
          icon: <TOOLBAR_ICONS.FORMATS.EXCEL />,
          label: intl.formatMessage({ id: 'download.excel.all', defaultMessage: 'Excel (All Data)' }),
          onClick: () => handleDownload(`${DOWNLOAD_FORMATS.EXCEL}-all`),
        },
        { type: 'divider' },
        {
          key: 'csv-selection',
          icon: <TOOLBAR_ICONS.FORMATS.CSV />,
          label: intl.formatMessage({ id: 'download.csv.selection', defaultMessage: 'CSV (Selection)' }),
          onClick: () => handleDownload(DOWNLOAD_FORMATS.CSV),
        },
        {
          key: 'csv-all',
          icon: <TOOLBAR_ICONS.FORMATS.CSV />,
          label: intl.formatMessage({ id: 'download.csv.all', defaultMessage: 'CSV (All Data)' }),
          onClick: () => handleDownload(`${DOWNLOAD_FORMATS.CSV}-all`),
        },
        { type: 'divider' },
        {
          key: 'json',
          icon: <TOOLBAR_ICONS.FORMATS.JSON />,
          label: intl.formatMessage({ id: 'download.json', defaultMessage: 'JSON' }),
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
          label: intl.formatMessage({ id: 'download.png', defaultMessage: 'Image (PNG)' }),
          onClick: () => handleDownload(DOWNLOAD_FORMATS.PNG),
        },
        {
          key: 'svg',
          icon: <TOOLBAR_ICONS.FORMATS.PNG />,
          label: intl.formatMessage({ id: 'download.svg', defaultMessage: 'Image (SVG)' }),
          onClick: () => handleDownload(DOWNLOAD_FORMATS.SVG),
        },
        { type: 'divider' },
        {
          key: 'pdf',
          icon: <TOOLBAR_ICONS.FORMATS.PDF />,
          label: intl.formatMessage({ id: 'download.pdf', defaultMessage: 'PDF Document' }),
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
          label: intl.formatMessage({ id: 'download.pdf.report', defaultMessage: 'PDF Report' }),
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
        disabled={disabled}
        aria-label={intl.formatMessage({ id: 'toolbar.action.download', defaultMessage: 'Download' })}
        data-testid="download-menu"
      >
        <FormattedMessage id="toolbar.action.download" defaultMessage="Download" />
      </Button>
    </Dropdown>
  );
});

DownloadMenu.displayName = 'DownloadMenu';
