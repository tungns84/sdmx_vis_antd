import React from 'react';
import * as R from 'ramda';
import useLoading from '../hooks/useLoading';
import useError from '../hooks/useError';
import { TableVisualisation } from './vis/vis-data';
import useSdmxData from '../hooks/useSdmxData';
import useSdmxACForFrequency from '../hooks/sdmx/useSdmxACForFrequency';
import useSdmxACForTimePeriod from '../hooks/sdmx/useSdmxACForTimePeriod';

const VisTable = ({ maxWidth, isFull, footerProps }) => {
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
        {loading || ''}
      </span>
    </>
  );
};

export default VisTable;
