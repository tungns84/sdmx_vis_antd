/**
 * Clean Demo - Simplified SDMX Visualization
 * Migration from old codebase to React/TypeScript
 */

import React, { useState, useCallback, useEffect } from 'react';
import { message, Spin, Alert } from 'antd';
import SDMXTableAutoFreeze from '../lib/dotstatsuite-antd/components/table/SDMXTableAutoFreeze';
import { SDMXData, TableLayout } from '../lib/dotstatsuite-antd/types';
import TableToolbar from '../lib/dotstatsuite-antd/components/toolbar/TableToolbar';
import { LayoutPanel, SharePanel, ApiPanel } from '../lib/dotstatsuite-antd/components/toolbar/panels';
import { parseSDMXJSON, getDefaultLayout } from '../lib/dotstatsuite-antd/utils/sdmx-json-parser';
import sampleData from '../../sampleData.json';

const CleanDemo: React.FC = () => {
  const [data, setData] = useState<SDMXData | null>(null);
  const [layout, setLayout] = useState<TableLayout>({
    header: ['TIME_PERIOD', 'INDICATOR'],
    rows: ['UNIT'],
    sections: ['REF_AREA', 'URBANIZATION'] // Multiple dimensions in sections to test freeze
  });
  const [activeView, setActiveView] = useState<'table' | 'chart'>('table');
  const [displayMode, setDisplayMode] = useState<'id' | 'name' | 'both'>('name');
  const [actionId, setActionId] = useState<'config' | 'share' | 'api' | 'download' | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load and parse SDMX data
  useEffect(() => {
    try {
      setLoading(true);
      console.log('Parsing SDMX data from sampleData.json...');
      
      const parsedData = parseSDMXJSON(sampleData as any);
      console.log('Parsed data:', parsedData);
      
      setData(parsedData);
      
      // Set default layout based on data
      const defaultLayout = getDefaultLayout(parsedData);
      console.log('Default layout:', defaultLayout);
      setLayout(defaultLayout);
      
      message.success('SDMX data loaded successfully');
      setLoading(false);
    } catch (err) {
      console.error('Error parsing SDMX data:', err);
      setError(err instanceof Error ? err.message : 'Failed to parse SDMX data');
      setLoading(false);
      message.error('Failed to load SDMX data');
    }
  }, []);

  const handleLayoutChange = useCallback((newLayout: TableLayout) => {
    setLayout(newLayout);
    message.success('Layout updated');
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Toolbar */}
      <TableToolbar
        viewerId={activeView as any}
        availableCharts={['line', 'bar', 'column']}
        displayMode={displayMode}
        actionId={actionId}
        isFullscreen={false}
        onViewerChange={(viewer) => {
          if (viewer === 'table') setActiveView('table');
          else if (viewer === 'chart') setActiveView('chart');
        }}
        onDisplayModeChange={setDisplayMode}
        onActionChange={setActionId}
        onFullscreenToggle={() => {
          message.info('Fullscreen coming soon');
        }}
      />

      {/* Panels */}
      {actionId === 'config' && data && (
        <LayoutPanel
          data={data}
          currentLayout={layout}
          onLayoutChange={handleLayoutChange}
          onClose={() => setActionId(null)}
        />
      )}

      {actionId === 'share' && (
        <SharePanel
          url={window.location.href}
          embedCode={`<iframe src="${window.location.href}" width="100%" height="600"></iframe>`}
          onClose={() => setActionId(null)}
        />
      )}

      {actionId === 'api' && (
        <ApiPanel
          dataUrl="/api/data/v1/sdmx"
          metadataUrl="/api/metadata/v1/sdmx"
          onClose={() => setActionId(null)}
        />
      )}

      {/* Main Table */}
      <div style={{ padding: 16 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 50 }}>
            <Spin size="large" tip="Loading SDMX data..." />
          </div>
        ) : error ? (
          <Alert
            message="Error loading data"
            description={error}
            type="error"
            showIcon
          />
        ) : data ? (
          <>
            <div style={{ marginBottom: 16 }}>
              <Alert
                message="SDMX Data Loaded"
                description={`Loaded ${data.observations.length} observations with ${data.dimensions.length} dimensions`}
                type="success"
                showIcon
                closable
              />
            </div>
            <SDMXTableAutoFreeze
              data={data}
              layout={layout}
              display={displayMode}
            />
          </>
        ) : (
          <Alert
            message="No data available"
            type="warning"
            showIcon
          />
        )}
      </div>
    </div>
  );
};

export default CleanDemo;