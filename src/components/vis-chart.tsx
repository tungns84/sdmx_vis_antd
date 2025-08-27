import React, { useRef, useEffect } from 'react';
import * as R from 'ramda';
import { useSelector } from 'react-redux';
import { Card, Spin, Empty, Alert, Space, Typography } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import * as d3 from 'd3';
import useLoading from '../hooks/useLoading';
import useError from '../hooks/useError';
import { ChartVisualisation } from './vis/vis-data';
import { getLocale } from '../selectors/router';
import useSdmxData from '../hooks/useSdmxData';
import useSdmxACForFrequency from '../hooks/sdmx/useSdmxACForFrequency';
import useSdmxACForTimePeriod from '../hooks/sdmx/useSdmxACForTimePeriod';

const { Text } = Typography;

interface VisChartProps {
  type: 'bar' | 'line' | 'pie' | 'area' | 'scatter';
  maxWidth?: number;
  isFull?: boolean;
  footerProps?: any;
}

/**
 * D3.js Chart Component Placeholder
 * Will be implemented with actual D3.js charts
 */
const D3ChartPlaceholder: React.FC<{ type: string; data?: any }> = ({ type, data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    // This is where D3.js chart implementation will go
    // For now, just show a placeholder
    const svg = d3.select(svgRef.current);
    const width = 600;
    const height = 400;

    svg
      .attr("width", width)
      .attr("height", height)
      .style("background", "#f0f0f0");

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .style("fill", "#666")
      .text(`${type.toUpperCase()} Chart - D3.js Implementation Coming Soon`);

  }, [type, data]);

  return <svg ref={svgRef} style={{ width: '100%', maxWidth: '600px' }} />;
};

/**
 * Visualization Chart Component
 * Displays SDMX data in various chart formats using D3.js
 * Migrated to TypeScript with AntD components
 */
const VisChart: React.FC<VisChartProps> = ({ 
  type, 
  maxWidth, 
  isFull, 
  footerProps 
}) => {
  const locale = useSelector(getLocale);
  const { isLoading: isLoadingData } = useSdmxData();
  const { noData, errorMessage } = useError();
  const { isLoading: isLoadingACForFrequency } = useSdmxACForFrequency();
  const { isLoading: isLoadingACForTimePeriod } = useSdmxACForTimePeriod();
  
  const isLoading = R.any(R.identity)([
    isLoadingData,
    isLoadingACForFrequency,
    isLoadingACForTimePeriod,
  ]);

  const { loading, loadingProps } = useLoading({ isLoading });

  // Handle different states
  if (loading) {
    return (
      <Card style={{ textAlign: 'center', padding: '48px' }}>
        <Spin 
          indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
          tip="Loading chart data..."
        />
        <span aria-live="assertive" className="sr-only">
          Loading chart data...
        </span>
      </Card>
    );
  }

  if (errorMessage) {
    return (
      <Alert
        message="Error Loading Chart"
        description={errorMessage}
        type="error"
        showIcon
        style={{ margin: '16px' }}
      />
    );
  }

  if (noData) {
    return (
      <Card>
        <Empty
          description="No data available for chart"
          style={{ padding: '48px' }}
        />
      </Card>
    );
  }

  // For now, use the original ChartVisualisation for table type
  // and D3.js placeholder for actual charts
  if (type === 'table') {
    return (
      <>
        <ChartVisualisation
          locale={locale}
          maxWidth={maxWidth}
          isFull={isFull}
          type={type}
          loading={loading}
          loadingProps={loadingProps}
          noData={noData}
          errorMessage={errorMessage}
          footerProps={footerProps}
        />
        <span aria-live="assertive" className="sr-only">
          {loading ? 'Loading data...' : 'Data loaded'}
        </span>
      </>
    );
  }

  // D3.js chart implementation
  return (
    <Card>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Text strong>
          {type.charAt(0).toUpperCase() + type.slice(1)} Chart
        </Text>
        <D3ChartPlaceholder type={type} data={null} />
      </Space>
      <span aria-live="assertive" className="sr-only">
        {type} chart displayed
      </span>
    </Card>
  );
};

export default VisChart;
