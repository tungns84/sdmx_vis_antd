import { useIntl } from 'react-intl';
import * as R from 'ramda';
import { applyFormat, sdmxFormat } from '../lib/sdmx/frequency';
import {
  addI18nLabels,
  END_PERIOD,
  getUsedFilterFrequency,
  getUsedFilterPeriod,
  LASTNOBSERVATIONS,
  START_PERIOD,
} from '../utils/used-filter';
import { getDateLocale } from '../i18n/dates';
import { formatMessage } from '../i18n';
import messages from '../components/messages';
import { locales } from '../lib/settings';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAvailableFrequencies,
  getFrequency,
  getFrequencyArtefact,
  getTimePeriodArtefact,
} from '../selectors/sdmx';
import {
  getLastNObservations,
  getLocale,
  getLastNMode,
  getPeriod as getRouterPeriod,
} from '../selectors/router';
import { resetSpecialFilters } from '../ducks/sdmx';

export default () => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const frequency = useSelector(getFrequency);
  const timePeriod = useSelector(getTimePeriodArtefact);
  const frequencyArtefact = useSelector(getFrequencyArtefact);
  const period = useSelector(getRouterPeriod);
  const lastNObs = useSelector(getLastNObservations);
  const lastNMode = useSelector(getLastNMode);
  const labels = {
    LASTNOBSERVATIONS: 'timeSeries',
    LASTNPERIODS: 'periods',
  };
  const locale = useSelector(getLocale);
  const availableFrequencies = useSelector(getAvailableFrequencies);
  const frequencyFilter = getUsedFilterFrequency(
    frequency,
    availableFrequencies,
  )(frequencyArtefact);
  const periodFilter = getUsedFilterPeriod(
    frequency,
    period,
    lastNObs,
    applyFormat(
      frequency,
      {
        ...sdmxFormat,
        M: R.pathOr(sdmxFormat.M, [locale, 'timeFormat'], locales),
      },
      { locale: getDateLocale(locale) },
    ),
    timePeriod,
    lastNMode,
  );
  const isLastNMode = !R.isNil(lastNMode) && R.has(lastNMode, labels);
  const periodLabels = {
    [START_PERIOD]: formatMessage(intl)(messages.periodStart),
    [END_PERIOD]: formatMessage(intl)(messages.periodEnd),
    [LASTNOBSERVATIONS]: [
      formatMessage(intl)(messages.periodLast),
      isLastNMode && formatMessage(intl)(messages[R.prop(lastNMode, labels)]),
    ],
  };
  const items = R.concat(
    frequencyFilter,
    addI18nLabels(periodLabels)(periodFilter),
  );
  const onDelete = (_, ids) => dispatch(resetSpecialFilters(_, ids));
  return {
    specialFiltersItems: items,
    onDeleteSpecialFilters: onDelete,
    frequencyFilter,
    periodFilter,
    periodLabels,
  };
};
