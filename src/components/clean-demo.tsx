/**
 * Clean Demo - Simplified SDMX Visualization
 * Migration from old codebase to React/TypeScript
 */

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { message, Spin, Alert, Row, Col, Card, Statistic, Space } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import SDMXTableAutoFreeze from '../lib/dotstatsuite-antd/components/table/SDMXTableAutoFreeze';
import { SDMXData, TableLayout } from '../lib/dotstatsuite-antd/types';
import TableToolbar from '../lib/dotstatsuite-antd/components/toolbar/TableToolbar';
import { LayoutPanel, SharePanel, ApiPanel } from '../lib/dotstatsuite-antd/components/toolbar/panels';
import FilterModal from '../lib/dotstatsuite-antd/components/filters/FilterModal';
import { filterObservations } from '../lib/dotstatsuite-antd/components/filters';
import { getDefaultLayout } from '../lib/dotstatsuite-antd/utils/sdmx-json-parser';
import { parseSDMX, SDMXVersion } from '../lib/dotstatsuite-antd/utils/sdmx-parser-factory';
import LanguageSelector from '../lib/dotstatsuite-antd/components/LanguageSelector';
import sampleData from '../../sampleData.json';

const CleanDemo: React.FC = () => {
  const [data, setData] = useState<SDMXData | null>(null);
  const [layout, setLayout] = useState<TableLayout>({
    header: [],
    rows: [],
    sections: []
  });
  const [activeView, setActiveView] = useState<'table' | 'chart'>('table');
  const [displayMode, setDisplayMode] = useState<'id' | 'name' | 'both'>('name');
  const [actionId, setActionId] = useState<'config' | 'share' | 'api' | 'download' | 'filter' | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [locale, setLocale] = useState<string>('en');

  // Load and parse SDMX data
  useEffect(() => {
    try {
      setLoading(true);
      console.log(`Parsing SDMX data with locale: ${locale}...`);
      
      const parsedData = parseSDMX(sampleData as any, SDMXVersion.AUTO, locale);
      console.log('Parsed data:', parsedData);
      
      setData(parsedData);
      
      // Initialize filters with empty arrays for each dimension
      const initialFilters: Record<string, string[]> = {};
      parsedData.dimensions.forEach(dim => {
        initialFilters[dim.id] = [];
      });
      setActiveFilters(initialFilters);
      
      // Set default layout based on data
      const defaultLayout = getDefaultLayout(parsedData);
      console.log('Default layout:', defaultLayout);
      setLayout(defaultLayout);
      
      message.success(`SDMX data loaded successfully (${locale})`);
      setLoading(false);
    } catch (err) {
      console.error('Error parsing SDMX data:', err);
      setError(err instanceof Error ? err.message : 'Failed to parse SDMX data');
      setLoading(false);
      message.error('Failed to load SDMX data');
    }
  }, [locale]); // Re-parse when locale changes

  const handleLayoutChange = useCallback((newLayout: TableLayout) => {
    setLayout(newLayout);
    message.success('Layout updated');
  }, []);

  // Filter data based on active filters
  const filteredData = useMemo(() => {
    if (!data) return null;
    
    const filtered = filterObservations(data.observations, activeFilters);
    console.log(`Filtered ${filtered.length} of ${data.observations.length} observations`);
    
    return {
      ...data,
      observations: filtered
    };
  }, [data, activeFilters]);

  // Calculate filter statistics
  const filterStats = useMemo(() => {
    if (!data || !filteredData) return null;
    
    const activeFilterCount = Object.values(activeFilters)
      .reduce((sum, values) => sum + values.length, 0);
    
    return {
      totalObservations: data.observations.length,
      filteredObservations: filteredData.observations.length,
      activeFilters: activeFilterCount,
      percentage: Math.round((filteredData.observations.length / data.observations.length) * 100)
    };
  }, [data, filteredData, activeFilters]);

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Toolbar with Language Selector */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', borderBottom: '1px solid #e0e0e0' }}>
        <TableToolbar
          viewerId={activeView as any}
          availableCharts={['line', 'bar', 'column']}
          displayMode={displayMode}
          actionId={actionId}
          isFullscreen={false}
          filtersVisible={actionId === 'filter'}
          onViewerChange={(viewer) => {
            if (viewer === 'table') setActiveView('table');
            else if (viewer === 'chart') setActiveView('chart');
          }}
          onDisplayModeChange={setDisplayMode}
          onActionChange={setActionId}
          onFullscreenToggle={() => {
            message.info('Fullscreen coming soon');
          }}
          onFilterToggle={() => {
            setActionId(actionId === 'filter' ? null : 'filter');
          }}
          features={{
            showFilters: true
          }}
        />
        
        {/* Language Selector */}
        <div style={{ paddingRight: 16 }}>
          <Space>
            <GlobalOutlined style={{ color: '#666' }} />
            <LanguageSelector
              value={locale}
              onChange={(newLocale) => {
                setLocale(newLocale);
                message.info(`Switching to ${newLocale.toUpperCase()}`);
              }}
              showFlag={true}
              style={{ minWidth: 120 }}
            />
          </Space>
        </div>
      </div>

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

      {actionId === 'filter' && data && (
        <FilterModal
          dimensions={data.dimensions.filter(d => 
            // Show all dimensions with multiple values
            d.values.length > 1 && d.values.length < 100
          )}
          observations={data.observations}
          activeFilters={activeFilters}
          onFiltersChange={setActiveFilters}
          onClose={() => setActionId(null)}
          showCounts={true}
          layoutDimensions={[...layout.header, ...layout.rows, ...layout.sections]}
        />
      )}

      {/* Main Content Area */}
      <div style={{ padding: 16, background: '#fff', height: 'calc(100vh - 120px)', overflow: 'auto' }}>
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
          ) : filteredData && filteredData.observations.length === 0 ? (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: '300px',
              color: '#999'
            }}>
              <div style={{ textAlign: 'center' }}>
                <h2>No data matches the current filters</h2>
                <p>Try adjusting your filter selection or clear filters</p>
              </div>
            </div>
          ) : filteredData ? (
            <>
              {Object.values(activeFilters).some(v => v.length > 0) && (
                <div style={{ marginBottom: 16 }}>
                  <Alert
                    message="Filters Applied"
                    description={`Showing ${filteredData.observations.length} of ${data?.observations.length || 0} observations`}
                    type="info"
                    showIcon
                    closable
                  />
                </div>
              )}
              <SDMXTableAutoFreeze
                data={filteredData}
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