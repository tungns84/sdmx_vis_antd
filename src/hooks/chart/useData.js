import * as R from 'ramda';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getDisplay, getViewer } from '../../selectors/router';
import { getData } from '../../selectors/sdmx';
import { rules } from '@sis-cc/dotstatsuite-components';
import { getDataAttributes, getDataDimensions } from '../../selectors/data';
import useMap from './useMap';
import { getDataFrequency } from '@sis-cc/dotstatsuite-sdmxjs';

export default ({ focus, chartDimension, formatterIds }) => {
  const { map } = useMap();
  const type = useSelector(getViewer);
  const display = useSelector(getDisplay);
  const data = useSelector(getData);
  const dimensions = useSelector(getDataDimensions);
  const attributes = useSelector(getDataAttributes);

  const series = useMemo(() => {
    if (R.isNil(data)) return null;
    return rules.series(
      data,
      type,
      focus,
      chartDimension,
      map,
      display,
      formatterIds,
    );
  }, [data, type, display, focus, chartDimension, map, formatterIds]);

  const frequency = useMemo(() => {
    return getDataFrequency({ dimensions, attributes });
  }, [dimensions, attributes]);

  return {
    frequency,
    series,
    share: { focused: focus, chartDimension },
  };
};
