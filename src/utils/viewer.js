import * as R from 'ramda';
import {
  defaultCombinations,
  customAttributes,
  cellsLimit,
} from '../lib/settings';

export const getShareConfig = ({
  mode,
  sdmxUrl,
  requestArgs,
  localeId,
  dataflow,
  isTimeInverted,
  layoutIds,
  map,
  display,
  timeFormats,
  observationsType,
}) => {
  return R.when(
    R.always(mode === 'latest'),
    R.mergeRight({
      sdmxSource: R.dissoc('locale', requestArgs),
      sdmxUrl,
      defaultCombinations: defaultCombinations,
      customAttributes: customAttributes,
      chart: { map },
      table: {
        isTimeInverted,
        layoutIds,
        limit: cellsLimit,
      },
    }),
  )({
    dataflowId: dataflow.id,
    locale: localeId,
    timeFormats,
    display,
    observationsType,
  });
};

export const getShareData = (viewerProps, mode, config) => {
  const {
    isDefaultTitle = true,
    isDefaultSubtitle = true,
    isDefaultSourceLabel = true,
  } = viewerProps;

  const title = isDefaultTitle
    ? null
    : R.path(['headerProps', 'title', 'label'], viewerProps);
  const subtitle = isDefaultSubtitle
    ? null
    : R.path(['headerProps', 'subtitle', 0, 'label'], viewerProps);
  const sourceLabel = isDefaultSourceLabel
    ? null
    : R.path(['footerProps', 'source', 'label'], viewerProps);

  const chartConfig = R.pathOr({}, ['chartData', 'share'], viewerProps);

  const { cellsLimit, range } = viewerProps;

  return R.pipe(
    R.pick([
      'chartData',
      'chartOptions',
      'tableProps',
      'headerProps',
      'footerProps',
      'hasAccessibility',
      'isRtl',
      'type',
    ]),
    R.mergeRight({ mode, config }),
    R.over(R.lensProp('config'), R.mergeRight({ cellsLimit, range })),
    R.assocPath(['config', 'informations'], { title, subtitle, sourceLabel }),
    R.over(R.lensPath(['config', 'chart']), R.mergeRight(chartConfig)),
    R.dissocPath(['headerProps', 'disclaimer']),
    R.evolve({
      footerProps: R.pipe(
        R.when(R.prop('copyright'), R.assoc('withCopyright', true)),
        R.dissoc('copyright'),
      ),
    }),
    R.ifElse(
      R.propEq('table', 'type'),
      R.omit(['chartData', 'chartOptions']),
      R.pipe(R.dissoc('tableProps'), R.dissocPath(['config', 'table'])),
    ),
    R.ifElse(
      R.propEq('latest', 'mode'),
      R.omit(['chartData', 'tableProps']),
      R.evolve({ config: R.omit(['chart', 'informations']) }),
    ),
  )(viewerProps);
};

export const getIsDefaultInformations = (properties) =>
  R.pipe(
    R.props(['title', 'subtitle', 'source']),
    R.map((prop) => (R.isNil(prop) ? true : R.prop('isDefault', prop))),
    ([isDefaultTitle, isDefaultSubtitle, isDefaultSourceLabel]) => ({
      isDefaultTitle,
      isDefaultSubtitle,
      isDefaultSourceLabel,
    }),
  )(properties);
