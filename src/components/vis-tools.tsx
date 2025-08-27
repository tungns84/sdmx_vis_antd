import React from 'react';
import { useSelector } from 'react-redux';
import * as R from 'ramda';
import { Collapse, Divider, Card, Space } from 'antd';
import ToolBar from './ToolBar';
import { getVisActionId } from '../selectors';
import { getViewer, getIsOverview } from '../selectors/router';
import APIQueries from './vis/api-queries';
import ShareView from './vis/share';
import { getUser } from '../selectors/app.js';
import { TABLE, MARGE_RATIO } from '../utils/constants';
import { getIsMicrodata } from '../selectors/microdata';
import Panel from './vis/Panel';
import Config from './vis-tools/config';
import Table from './vis-tools/table';
import useShortenUrl from '../hooks/useShortenUrl';
import useMaxWidth from '../hooks/useMaxWidth';
import styles from './vis-tools.module.css';

const { Panel: CollapsePanel } = Collapse;

const API = 'api';
const CONFIG = 'config';
const SHARE = 'share';

interface ToolsProps {
  maxWidth?: number;
  isFull?: boolean;
  viewerProps?: any;
  properties?: any;
}

/**
 * Tools Component - Toolbar and configuration panels
 * Migrated to AntD + TypeScript
 */
const Tools: React.FC<ToolsProps> = ({ 
  maxWidth = 1200, 
  isFull = false, 
  viewerProps, 
  properties = {} 
}) => {
  const isMicrodata = useSelector(getIsMicrodata);
  const actionId = useSelector(getVisActionId());
  const viewerId = useSelector(getViewer);
  const isAuthenticated = !!useSelector(getUser);
  const isOverview = useSelector(getIsOverview);
  const { props, shortenUrl } = useShortenUrl();

  const maxWidthStyles = useMaxWidth({
    visWidth: maxWidth - maxWidth * (1 - MARGE_RATIO),
    isFull: R.or(isFull, isMicrodata),
  });

  const isApi = R.equals(API)(actionId);
  const isTableConfig = R.equals(CONFIG)(actionId) && R.equals(TABLE)(viewerId);
  const isChartConfig = R.equals(CONFIG)(actionId) && !R.equals(TABLE)(viewerId);
  const isShare = R.equals(SHARE)(actionId);

  // Determine which panels to show
  const activeKey = [];
  if (isApi) activeKey.push(API);
  if (isTableConfig) activeKey.push('table-config');
  if (isChartConfig) activeKey.push('chart-config');
  if (isShare) activeKey.push(SHARE);

  return (
    <div className={styles.toolbar} style={maxWidthStyles}>
      <ToolBar viewerProps={viewerProps} />
      
      <Collapse 
        activeKey={activeKey}
        ghost
        className={styles.panels}
      >
        {/* API Queries Panel */}
        <CollapsePanel 
          key={API} 
          header="API Queries"
          showArrow={false}
          className={styles.panel}
        >
          <APIQueries />
        </CollapsePanel>

        {/* Table Configuration Panel */}
        <CollapsePanel 
          key="table-config" 
          header="Table Configuration"
          showArrow={false}
          className={styles.panel}
        >
          <Table />
        </CollapsePanel>

        {/* Chart Configuration Panel */}
        <CollapsePanel 
          key="chart-config" 
          header="Chart Configuration"
          showArrow={false}
          className={styles.panel}
        >
          <Config isAuthenticated={isAuthenticated} properties={properties} />
        </CollapsePanel>

        {/* Share Panel */}
        <CollapsePanel 
          key={SHARE} 
          header="Share"
          showArrow={false}
          className={styles.panel}
        >
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            {isAuthenticated && (
              <>
                <Card size="small">
                  <button onClick={shortenUrl}>Shorten URL</button>
                </Card>
                <Divider />
              </>
            )}
            <ShareView isOverview={isOverview} />
          </Space>
        </CollapsePanel>
      </Collapse>
    </div>
  );
};

export default Tools;
