/**
 * Viewer Selector Component
 * Following react rule: Keep components small and focused
 */

import React, { memo } from 'react';
import { Button, Space, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { ViewerType, ChartType } from '../../../types/toolbar.types';
import { TOOLBAR_ICONS, TOOLBAR_LABELS, VIEWER_TYPES, CHART_TYPES } from '../../../constants/toolbar.constants';

interface ViewerSelectorProps {
  currentViewer: ViewerType;
  availableCharts?: ChartType[];
  hasMicrodata?: boolean;
  onViewerChange: (viewer: ViewerType) => void;
}

/**
 * Viewer Selector Component
 * Allows users to switch between different view modes
 */
export const ViewerSelector: React.FC<ViewerSelectorProps> = memo(({
  currentViewer,
  availableCharts = [],
  hasMicrodata = false,
  onViewerChange,
}) => {
  // Chart icon mapping
  const getChartIcon = (chartType: ChartType) => {
    const iconMap: Record<ChartType, React.ReactNode> = {
      line: <TOOLBAR_ICONS.VIEWERS.LINE />,
      bar: <TOOLBAR_ICONS.VIEWERS.BAR />,
      column: <TOOLBAR_ICONS.VIEWERS.BAR />,
      area: <TOOLBAR_ICONS.VIEWERS.AREA />,
      pie: <TOOLBAR_ICONS.VIEWERS.PIE />,
      scatter: <TOOLBAR_ICONS.VIEWERS.LINE />,
    };
    return iconMap[chartType] || <TOOLBAR_ICONS.VIEWERS.LINE />;
  };

  // Chart submenu items
  const chartItems: MenuProps['items'] = availableCharts.map(chart => ({
    key: chart,
    icon: getChartIcon(chart),
    label: chart.charAt(0).toUpperCase() + chart.slice(1),
    onClick: () => onViewerChange(VIEWER_TYPES.CHART),
  }));

  const isChartSelected = currentViewer === VIEWER_TYPES.CHART;

  return (
    <Space size="small">
      {/* Overview Button */}
      <Button
        type={currentViewer === VIEWER_TYPES.OVERVIEW ? 'primary' : 'default'}
        icon={<TOOLBAR_ICONS.VIEWERS.OVERVIEW />}
        onClick={() => onViewerChange(VIEWER_TYPES.OVERVIEW)}
        aria-pressed={currentViewer === VIEWER_TYPES.OVERVIEW}
        data-testid="viewer-overview"
      >
        {TOOLBAR_LABELS.VIEWERS.OVERVIEW}
      </Button>

      {/* Table Button */}
      <Button
        type={currentViewer === VIEWER_TYPES.TABLE ? 'primary' : 'default'}
        icon={<TOOLBAR_ICONS.VIEWERS.TABLE />}
        onClick={() => onViewerChange(VIEWER_TYPES.TABLE)}
        aria-pressed={currentViewer === VIEWER_TYPES.TABLE}
        data-testid="viewer-table"
      >
        {TOOLBAR_LABELS.VIEWERS.TABLE}
      </Button>

      {/* Microdata Button (conditional) */}
      {hasMicrodata && (
        <Button
          type={currentViewer === VIEWER_TYPES.MICRODATA ? 'primary' : 'default'}
          icon={<TOOLBAR_ICONS.VIEWERS.MICRODATA />}
          onClick={() => onViewerChange(VIEWER_TYPES.MICRODATA)}
          aria-pressed={currentViewer === VIEWER_TYPES.MICRODATA}
          data-testid="viewer-microdata"
        >
          {TOOLBAR_LABELS.VIEWERS.MICRODATA}
        </Button>
      )}

      {/* Charts Dropdown */}
      {availableCharts.length > 0 && (
        <Dropdown
          menu={{ items: chartItems }}
          placement="bottomLeft"
          trigger={['click']}
        >
          <Button
            type={isChartSelected ? 'primary' : 'default'}
            aria-pressed={isChartSelected}
            data-testid="viewer-charts"
          >
            <Space>
              <TOOLBAR_ICONS.VIEWERS.LINE />
              {TOOLBAR_LABELS.VIEWERS.CHARTS}
              <DownOutlined />
            </Space>
          </Button>
        </Dropdown>
      )}
    </Space>
  );
});

ViewerSelector.displayName = 'ViewerSelector';
