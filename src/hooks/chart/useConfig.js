import * as R from 'ramda';
import deepEqual from 'deep-equal';
import { create } from 'zustand';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDisplay, getViewer } from '../../selectors/router';
import { getCustomAttributes, getVisDataflow } from '../../selectors';
import { getData } from '../../selectors/sdmx';
import { chartOptions as defaultChartOptions } from '../../lib/settings';
import { rules } from '@sis-cc/dotstatsuite-components';
import { getHeaderSubtitle, getHeaderTitle } from '../../selectors/data';
import useMap from './useMap';
import { UPDATE_CHART_CONFIG } from '../../middlewares/analytics';

const defaultChartConfig = {
  highlight: [],
  baseline: [],
  fixedWidth: undefined,
  fixedHeight: undefined,
  freqStep: undefined,
  responsiveWidth: undefined,
  responsiveHeight: undefined,
  scatterDimension: undefined,
  scatterX: undefined,
  scatterY: undefined,
  symbolDimension: undefined,
  stackedDimension: undefined,
  stackedMode: undefined,
  title: undefined,
  subtitle: undefined,
  sourceLabel: undefined,
  withLogo: true,
  withCopyright: true,
};

export const useChartConfigStore = create((set) => ({
  chartConfig: defaultChartConfig,
  setChartConfig: (nextChartConfig) =>
    set((state) => ({
      chartConfig: R.mergeLeft(nextChartConfig, state.chartConfig),
    })),
}));

const isEqual = (prev, next) => {
  // prev is the previous full state
  // next is a set of updated attrs
  // next doesn't contain the whole state prev
  // only compare keys from next with scope prev
  const scopedPrev = R.pick(R.keys(next), prev);
  return deepEqual(scopedPrev, next);
};

export default () => {
  const dispatch = useDispatch();
  const { map } = useMap();
  const type = useSelector(getViewer);
  const customAttributes = useSelector(getCustomAttributes);
  const data = useSelector(getData);
  const dataflow = useSelector(getVisDataflow);
  const display = useSelector(getDisplay);
  const headerTitle = useSelector(getHeaderTitle);
  const headerSubtitle = useSelector(getHeaderSubtitle);

  const formatterIds = useMemo(() => {
    return R.pipe(
      R.pick(['prefscale', 'decimals']),
      R.mapObjIndexed(R.of(Array)),
    )(customAttributes);
  }, [customAttributes]);

  const { chartConfig, setChartConfig } = useChartConfigStore();
  //const [chartConfig, setChartConfig] = useState(defaultChartConfig);
  const setChartConfigWrapper = (nextChartConfig) => {
    if (isEqual(chartConfig, nextChartConfig)) return;
    dispatch({ type: UPDATE_CHART_CONFIG });
    setChartConfig(nextChartConfig);
    //setChartConfig(R.mergeLeft(nextChartConfig));
  };

  const properties = useMemo(() => {
    return rules.toProperties(
      {
        data,
        dataflow,
        type,
        options: defaultChartOptions,
        subtitle: headerSubtitle,
        title: headerTitle,
      },
      chartConfig,
      setChartConfigWrapper,
    );
  }, [data, dataflow, type, headerTitle, headerSubtitle, chartConfig]);

  useEffect(() => {
    if (type === 'overview' || type === 'table') return;
    setChartConfigWrapper(
      rules.stateFromNewProps(
        {
          data,
          dataflow,
          display,
          formatterIds,
          type,
          options: defaultChartOptions,
        },
        chartConfig,
      ),
    );
  }, [type, data, dataflow, display, formatterIds]);

  const hasNeedOfResponsiveSize = useMemo(() => {
    return (
      R.isNil(chartConfig.responsiveWidth) ||
      R.isNil(chartConfig.responsiveHeight)
    );
  }, [chartConfig]);

  const hasNeedOfComputedAxis = useMemo(() => {
    return R.pipe(
      R.pick([
        'computedMinX',
        'computedMaxX',
        'computedStepX',
        'computedPivotX',
        'computedMinY',
        'computedMaxY',
        'computedStepY',
        'computedPivotY',
      ]),
      R.all(R.isNil),
    )(chartConfig);
  }, [chartConfig]);

  const focus = useMemo(() => {
    return R.pick(['highlight', 'baseline'], chartConfig);
  }, [chartConfig]);

  const chartDimension = useMemo(() => {
    return rules.toSingularity({ data, type }, chartConfig);
  }, [data, type, chartConfig]);

  const chartOptions = useMemo(() => {
    return rules.toChartOptions(
      { type, map, options: defaultChartOptions },
      chartConfig,
    );
  }, [type, map, chartConfig]);

  return {
    chartConfig,
    setChartConfig: setChartConfigWrapper,
    properties,
    hasNeedOfComputedAxis,
    hasNeedOfResponsiveSize,
    focus,
    chartDimension,
    chartOptions,
    formatterIds,
  };
};
