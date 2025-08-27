import React, { useMemo } from 'react';
import * as R from 'ramda';
import { useSelector } from 'react-redux';
import { FormattedMessage } from '../i18n';
import useSdmxData from './useSdmxData';
import { getData } from '../selectors/sdmx';
import { getDuplicatedObservations } from '../selectors/data';
import useSdmxStructure from './useSdmxStructure';
import useGetUsedFilters from './useGetUsedFilters';
import useSdmxDataTime from './sdmx/useSdmxDataTime';
import useMap from './chart/useMap';
import { getViewer } from '../selectors/router';
import { getTimePeriodDimension } from '@sis-cc/dotstatsuite-sdmxjs';

export default () => {
  const { hasTime } = useSdmxDataTime();
  const { isError, error } = useSdmxData();
  const data = useSelector(getData);
  const type = useSelector(getViewer);
  const observations = useSelector(getDuplicatedObservations);
  const noObservations = R.isEmpty(observations) && !R.isNil(data);
  const { observationsCount, actualConstraints } = useSdmxStructure();
  const selection = useGetUsedFilters();
  const { isError: isErrorMap } = useMap();

  const hasNoTimeForChart = useMemo(() => {
    if (!R.equals('TimelineChart', type)) return false;

    const dimensions = R.pathOr(
      [],
      ['structure', 'dimensions', 'observation'],
      data,
    );

    const timeDimension = getTimePeriodDimension({ dimensions });
    if (R.isNil(timeDimension)) return true;

    return R.pipe(R.propOr([], 'values'), R.length, R.gte(1))(timeDimension);
  }, [data, type]);

  let noData = null;
  let errorMessage = null;
  if (isError || noObservations) {
    const status = error?.response?.status;
    if (status === 404 || noObservations) {
      if (observationsCount == 0 || R.isEmpty(actualConstraints))
        errorMessage = <FormattedMessage id="vx.no.data" />;
      else errorMessage = <FormattedMessage id="vx.no.data.selection" />;
    } else if (R.includes(status, [401, 402, 403]))
      errorMessage = <FormattedMessage id="log.error.sdmx.40x" />;
    else errorMessage = <FormattedMessage id="log.error.sdmx.xxx" />;
  } else {
    if (isErrorMap) errorMessage = <FormattedMessage id="vx.no.map" />;
    if (hasNoTimeForChart)
      errorMessage = <FormattedMessage id="vx.no.time.data" />;
    if (!hasTime) errorMessage = <FormattedMessage id="vx.no.data.selection" />;
    if (!R.isEmpty(selection))
      noData = <FormattedMessage id="vx.no.data.selection" />;
  }

  return { noData, errorMessage };
};
