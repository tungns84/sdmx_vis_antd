/**
 * Clean Demo - Simplified SDMX Visualization
 * Migration from old codebase to React/TypeScript
 */

import React, { useState, useCallback } from 'react';
import { message } from 'antd';
import SDMXTableHTML from '../lib/dotstatsuite-antd/components/table/SDMXTableHTML';
import { SDMXData, TableLayout } from '../lib/dotstatsuite-antd/types';
import TableToolbar from '../lib/dotstatsuite-antd/components/toolbar/TableToolbar';
import { LayoutPanel, SharePanel, ApiPanel } from '../lib/dotstatsuite-antd/components/toolbar/panels';

// Generate SDMX sample data
function generateSampleData(): SDMXData {
  return {
    dimensions: [
      {
        id: 'TIME_PERIOD',
        name: 'Time Period',
        values: [
          { id: '2021', name: '2021' },
          { id: '2022', name: '2022' },
          { id: '2023', name: '2023' },
        ]
      },
      {
        id: 'REF_AREA',
        name: 'Reference Area',
        values: [
          { id: 'US', name: 'United States' },
          { id: 'EU', name: 'European Union' },
          { id: 'JP', name: 'Japan' },
        ]
      },
      {
        id: 'INDICATOR',
        name: 'Indicator',
        values: [
          { id: 'GDP', name: 'GDP Growth' },
          { id: 'INF', name: 'Inflation' },
          { id: 'UNE', name: 'Unemployment' },
        ]
      },
    ],
    observations: generateObservations(),
    attributes: []
  };
}

function generateObservations(): any[] {
  const observations: any[] = [];
  const areas = ['US', 'EU', 'JP'];
  const periods = ['2021', '2022', '2023'];
  const indicators = ['GDP', 'INF', 'UNE'];
  
  areas.forEach(area => {
    indicators.forEach(indicator => {
      periods.forEach(period => {
        observations.push({
          REF_AREA: area,
          TIME_PERIOD: period,
          INDICATOR: indicator,
          OBS_VALUE: Math.random() * 10 - 2,
          DECIMALS: 2,
          UNIT_MEASURE: '%',
          // Add SDMX metadata occasionally
          ...(Math.random() > 0.7 && {
            OBS_STATUS: 'P',
            OBS_FLAG: 'p'
          }),
          ...(Math.random() > 0.9 && {
            OBS_STATUS: 'E', 
            OBS_FLAG: 'e'
          })
        });
      });
    });
  });
  
  return observations;
}

const CleanDemo: React.FC = () => {
  const [data] = useState<SDMXData>(generateSampleData());
  const [layout, setLayout] = useState<TableLayout>({
    header: ['TIME_PERIOD'],
    rows: ['REF_AREA', 'INDICATOR'],
    sections: []
  });
  const [activeView, setActiveView] = useState<'table' | 'chart'>('table');
  const [displayMode, setDisplayMode] = useState('name');
  const [actionId, setActionId] = useState<string | null>(null);

  const handleLayoutChange = useCallback((newLayout: TableLayout) => {
    setLayout(newLayout);
    message.success('Layout updated');
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <div style={{ background: '#fff', borderBottom: '1px solid #e8e8e8' }}>
        <TableToolbar
          viewerId={activeView === 'table' ? 'table' : 'chart'}
          displayMode={displayMode as any}
          actionId={actionId as any}
          isFullscreen={false}
          onViewerChange={(viewer) => setActiveView(viewer as any)}
          onDisplayModeChange={(mode) => setDisplayMode(mode)}
          onActionChange={(action) => setActionId(action as string | null)}
          onFullscreenToggle={() => {}}
          viewerProps={{ layout }}
        />
      </div>

      {/* Action Panels */}
      {actionId === 'config' && (
        <LayoutPanel
          data={data}
          currentLayout={layout}
          onLayoutChange={(newLayout) => {
            handleLayoutChange(newLayout);
            setActionId(null);
          }}
          onClose={() => setActionId(null)}
        />
      )}
      
      {actionId === 'share' && (
        <SharePanel
          url={window.location.href}
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
        <SDMXTableHTML
          data={data}
          layout={layout}
          display={displayMode as 'id' | 'name' | 'both'}
        />
      </div>
    </div>
  );
};

export default CleanDemo;