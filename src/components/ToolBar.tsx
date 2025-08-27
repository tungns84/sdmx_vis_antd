import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Space, Button, Select, Tooltip, Divider } from 'antd';
import {
  TableOutlined,
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  AreaChartOutlined,
  DotChartOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  DownloadOutlined,
  SettingOutlined,
  ShareAltOutlined,
  ApiOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import * as R from 'ramda';
import {
  changeActionId,
  changeDisplay,
  changeFullscreen,
  changeViewer,
} from '../ducks/vis';
import {
  getViewer,
  getDisplay,
  getIsOverview,
  getIsTable,
} from '../selectors/router';
import { getIsPending } from '../selectors/app.js';
import {
  getIsFull,
  getVisActionId,
  getAvailableCharts,
} from '../selectors';
import {
  getIsMicrodata,
  getHasMicrodata,
} from '../selectors/microdata';
import { EXCEL, PNG, TABLE, OVERVIEW, MICRODATA } from '../utils/constants';
import styles from './ToolBar.module.css';

interface ToolBarProps {
  viewerProps?: any;
}

const chartIcons: Record<string, React.ReactNode> = {
  bar: <BarChartOutlined />,
  line: <LineChartOutlined />,
  pie: <PieChartOutlined />,
  area: <AreaChartOutlined />,
  scatter: <DotChartOutlined />,
};

/**
 * ToolBar Component - Simplified version
 * Controls for visualization type, display options, and actions
 * Migrated to AntD + TypeScript
 */
const ToolBar: React.FC<ToolBarProps> = ({ viewerProps }) => {
  const dispatch = useDispatch();
  
  // Selectors
  const viewerId = useSelector(getViewer);
  const availableCharts = useSelector(getAvailableCharts);
  const actionId = useSelector(getVisActionId());
  const isFull = useSelector(getIsFull());
  const hasMicrodata = useSelector(getHasMicrodata);
  const isMicrodata = useSelector(getIsMicrodata);
  const isOverview = useSelector(getIsOverview);
  const isTable = useSelector(getIsTable);
  const isDownloading = useSelector(getIsPending('requestingDataFile'));
  const isPendingExcel = useSelector(getIsPending(EXCEL));
  const isPendingPng = useSelector(getIsPending(PNG));
  
  const isLoading = R.any(R.identity)([isPendingExcel, isPendingPng, isDownloading]);

  // Handlers
  const handleViewerChange = (value: string) => {
    dispatch(changeViewer(value));
  };

  const handleActionChange = (value: string) => {
    dispatch(changeActionId(value));
  };

  const handleFullscreenToggle = () => {
    dispatch(changeFullscreen(!isFull));
  };

  // View options for selector
  const viewOptions = [
    { label: 'Table', value: TABLE, icon: <TableOutlined /> },
    { label: 'Overview', value: OVERVIEW, icon: <AppstoreOutlined /> },
    ...(hasMicrodata ? [{ label: 'Microdata', value: MICRODATA, icon: <TableOutlined /> }] : []),
    ...availableCharts.map((chart: string) => ({
      label: chart.charAt(0).toUpperCase() + chart.slice(1),
      value: chart,
      icon: chartIcons[chart] || <BarChartOutlined />,
    })),
  ];

  // Action buttons
  const actionButtons = [
    { key: 'api', icon: <ApiOutlined />, label: 'API' },
    { key: 'config', icon: <SettingOutlined />, label: 'Config' },
    { key: 'share', icon: <ShareAltOutlined />, label: 'Share' },
    { key: 'download', icon: <DownloadOutlined />, label: 'Download' },
  ];

  return (
    <div className={styles.toolbar}>
      <Space split={<Divider type="vertical" />}>
        {/* View Selector */}
        <Space size="small">
          <span>View:</span>
          <Select
            value={viewerId}
            onChange={handleViewerChange}
            options={viewOptions}
            style={{ minWidth: 120 }}
            loading={isLoading}
          />
        </Space>

        {/* View-specific options */}
        {isTable && (
          <Button
            type={isOverview ? 'primary' : 'default'}
            icon={<AppstoreOutlined />}
            onClick={() => dispatch(changeViewer(OVERVIEW))}
          >
            Overview
          </Button>
        )}

        {/* Action Buttons */}
        <Space size="small">
          {actionButtons.map(action => (
            <Tooltip key={action.key} title={action.label}>
              <Button
                type={actionId === action.key ? 'primary' : 'default'}
                icon={action.icon}
                onClick={() => handleActionChange(action.key)}
                loading={action.key === 'download' && isLoading}
              />
            </Tooltip>
          ))}
        </Space>

        {/* Fullscreen Toggle */}
        <Tooltip title={isFull ? 'Exit Fullscreen' : 'Fullscreen'}>
          <Button
            icon={isFull ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
            onClick={handleFullscreenToggle}
          />
        </Tooltip>
      </Space>
    </div>
  );
};

export default ToolBar;
