import React from 'react';
import * as R from 'ramda';
import { useSelector } from 'react-redux';
import useLoading from '../hooks/useLoading';
import useError from '../hooks/useError';
import { ChartVisualisation } from './vis/vis-data';
import { getLocale } from '../selectors/router';
import useSdmxData from '../hooks/useSdmxData';
import useSdmxACForFrequency from '../hooks/sdmx/useSdmxACForFrequency';
import useSdmxACForTimePeriod from '../hooks/sdmx/useSdmxACForTimePeriod';

const VisChart = ({ type, maxWidth, isFull, footerProps }) => {
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
        {loading || ''}
      </span>
    </>
  );
};

export default VisChart;
