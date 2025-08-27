import { ExpansionPanel, Tag } from '@sis-cc/dotstatsuite-visions';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { changeFilter } from '../../ducks/vis';
import { formatMessage } from '../../i18n';
import { getIntervalPeriod } from '../../lib/sdmx/frequency.js';
import { getFilter } from '../../selectors';
import {
  getAvailableFrequencies,
  getDatesBoundaries,
  getFrequency,
  getFrequencyArtefact,
  getPeriod,
  getTimePeriodArtefact,
} from '../../selectors/sdmx';
import { getLastNMode, getLastNObservations } from '../../selectors/router';
import { PANEL_PERIOD } from '../../utils/constants';
import messages from '../messages';
import { tagAccessor } from './utils';
import { LASTNPERIODS } from '../../utils/used-filter';

const FilterPeriod = ({ children }) => {
  const intl = useIntl();
  const activePanelId = useSelector(getFilter);
  const period = useSelector(getPeriod);
  const frequency = useSelector(getFrequency);
  const availableFrequencies = useSelector(getAvailableFrequencies);
  const datesBoundaries = useSelector(getDatesBoundaries);
  const timePeriodArtefact = useSelector(getTimePeriodArtefact);
  const frequencyArtefact = useSelector(getFrequencyArtefact);
  const lastN = useSelector(getLastNObservations);
  const lastNMode = useSelector(getLastNMode);

  const dispatch = useDispatch();
  const onChangeActivePanel = (...args) => dispatch(changeFilter(...args));

  if (
    R.isNil(datesBoundaries) ||
    R.isNil(timePeriodArtefact) ||
    !timePeriodArtefact?.display
  )
    return null;
  const makeTagAriaLabel = (count, total) =>
    formatMessage(intl)(messages.tagLabel, { count, total });

  const periodLabel =
    timePeriodArtefact?.label || formatMessage(intl)(messages.last);
  const frequencyLabel =
    frequencyArtefact?.label || formatMessage(intl)(messages.head);

  const noFrequency = R.or(
    R.isEmpty(availableFrequencies),
    R.pipe(R.keys, R.length, R.equals(1))(availableFrequencies),
  );
  const label = noFrequency
    ? periodLabel
    : R.join(' & ')([frequencyLabel, periodLabel]);
  const tagValueLabel = R.pipe(
    getIntervalPeriod(datesBoundaries),
    ([count, total]) => makeTagAriaLabel(count, total),
  )(frequency, period);
  const tag = R.not(R.isNil(datesBoundaries)) && (
    <Tag tagValueLabel={tagValueLabel}>
      {R.pipe(getIntervalPeriod(datesBoundaries), ([count, total]) => {
        const lastNCount = R.equals(lastNMode, LASTNPERIODS)
          ? lastN
          : `${lastN}+`;
        return lastN
          ? tagAccessor(lastNCount, total)
          : tagAccessor(count, total);
      })(frequency, period)}
    </Tag>
  );

  return (
    <ExpansionPanel
      id={PANEL_PERIOD}
      overflow={true}
      isOpen={R.equals(PANEL_PERIOD, activePanelId)}
      label={label}
      tag={tag}
      onChangeActivePanel={onChangeActivePanel}
    >
      {children}
    </ExpansionPanel>
  );
};

FilterPeriod.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default FilterPeriod;
