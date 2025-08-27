import React from 'react';
import { FormattedMessage } from '../i18n';
import useSdmxStructure from './useSdmxStructure';
import useMap from './chart/useMap';

export default ({ isLoading }) => {
  const { isIncreased } = useSdmxStructure();
  const { isLoading: isLoadingMap } = useMap();

  let loading = null;
  let loadingProps = null;
  if (isLoading) {
    loading = isIncreased ? (
      <FormattedMessage id="de.visualisation.data.larger.loading" />
    ) : (
      <FormattedMessage id="de.visualisation.data.loading" />
    );
    loadingProps = isIncreased ? { isWarning: true } : {};
  } else if (isLoadingMap) {
    loading = <FormattedMessage id="de.vis.map.loading" />;
  }

  return { loading, loadingProps };
};
