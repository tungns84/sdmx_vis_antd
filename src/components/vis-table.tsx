import React from 'react';
import * as R from 'ramda';
import { Spin, Empty, Alert } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import useLoading from '../hooks/useLoading';
import useError from '../hooks/useError';
import { TableVisualisation } from './vis/vis-data';
import useSdmxData from '../hooks/useSdmxData';
import useSdmxACForFrequency from '../hooks/sdmx/useSdmxACForFrequency';
import useSdmxACForTimePeriod from '../hooks/sdmx/useSdmxACForTimePeriod';

interface VisTableProps {
  maxWidth?: number;
  isFull?: boolean;
  footerProps?: any;
}

/**
 * Visualization Table Component
 * Displays SDMX data in table format
 * Migrated to TypeScript with AntD components
 */
const VisTable: React.FC<VisTableProps> = ({ 
  maxWidth, 
  isFull, 
  footerProps 
}) => {
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

  // Handle different states with AntD components
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '48px' }}>
        <Spin 
          indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
          tip="Loading data..."
        />
        <span aria-live="assertive" className="sr-only">
          Loading table data...
        </span>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <Alert
        message="Error Loading Table"
        description={errorMessage}
        type="error"
        showIcon
        style={{ margin: '16px' }}
      />
    );
  }

  if (noData) {
    return (
      <Empty
        description="No data available"
        style={{ padding: '48px' }}
      />
    );
  }

  return (
    <>
      <TableVisualisation
        maxWidth={maxWidth}
        loading={loading}
        loadingProps={loadingProps}
        noData={noData}
        errorMessage={errorMessage}
        footerProps={footerProps}
        isFull={isFull}
      />
      <span aria-live="assertive" className="sr-only">
        {loading ? 'Loading table data...' : 'Table data loaded'}
      </span>
    </>
  );
};

export default VisTable;
