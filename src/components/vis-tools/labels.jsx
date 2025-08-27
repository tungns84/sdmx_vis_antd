import { formatMessage } from '../../i18n';
import {
  DISPLAY_BOTH,
  DISPLAY_CODE,
  DISPLAY_LABEL,
} from '../../utils/constants';
import messages from '../messages';

export default (intl) => ({
  focus: formatMessage(intl)(messages.focus),
  highlight: formatMessage(intl)(messages.highlight),
  select: formatMessage(intl)(messages.select),
  baseline: formatMessage(intl)(messages.baseline),
  size: formatMessage(intl)(messages.size),
  width: formatMessage(intl)(messages.width),
  height: formatMessage(intl)(messages.height),
  display: formatMessage(intl)(messages.display),
  displayOptions: {
    [DISPLAY_LABEL]: formatMessage(intl)(messages.label),
    [DISPLAY_CODE]: formatMessage(intl)(messages.code),
    [DISPLAY_BOTH]: formatMessage(intl)(messages.both),
  },
  series: formatMessage(intl)(messages.series),
  scatterDimension: formatMessage(intl)(messages.scatterDimension),
  scatterX: formatMessage(intl)(messages.scatterX),
  scatterY: formatMessage(intl)(messages.scatterY),
  symbolDimension: formatMessage(intl)(messages.symbolDimension),
  stackedDimension: formatMessage(intl)(messages.stackedDimension),
  stackedMode: formatMessage(intl)(messages.stackedMode),
  stackedModeOptions: {
    values: formatMessage(intl)(messages.values),
    percent: formatMessage(intl)(messages.percent),
  },
  axisX: formatMessage(intl)(messages.axisX),
  axisY: formatMessage(intl)(messages.axisY),
  max: formatMessage(intl)(messages.max),
  min: formatMessage(intl)(messages.min),
  pivot: formatMessage(intl)(messages.pivot),
  step: formatMessage(intl)(messages.step),
  frequency: formatMessage(intl)(messages.frequency),
  freqStep: formatMessage(intl)(messages.freqStep),
  title: formatMessage(intl)(messages.configTitle),
  subtitle: formatMessage(intl)(messages.subtitle),
  source: formatMessage(intl)(messages.source),
  logo: formatMessage(intl)(messages.logo),
  copyright: formatMessage(intl)(messages.copyright),
  reset: formatMessage(intl)(messages.reset),
  uniqFocusOption: formatMessage(intl)(messages.uniqFocusOption),
});
