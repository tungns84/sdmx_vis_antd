import { PeriodPicker } from '@sis-cc/dotstatsuite-visions';
import dateFns from 'date-fns';
import * as R from 'ramda';
import React, { useEffect, useRef } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { CHANGE_FREQUENCY_PERIOD } from '../../ducks/sdmx';
import { formatMessage } from '../../i18n';
import {
  getAvailableFrequencies,
  getDatesBoundaries,
  getFrequencyArtefact,
} from '../../selectors/sdmx';
import { periodMessages } from '../messages';
import { getSdmxPeriod } from '../../lib/sdmx/frequency';
import useSdmxAC from '../../hooks/sdmx/useSdmxAC';
import { getTimePeriodBoundaries } from '../../lib/sdmx/accessors/constraints';
import { getLastNMode } from '../../selectors/router';
import { LASTNPERIODS } from '../../utils/used-filter';

const Period = ({ period, changePeriod, frequency, changeFrequency }) => {
  const intl = useIntl();
  const availableFrequencies = useSelector(getAvailableFrequencies);
  const boundaries = useSelector(getDatesBoundaries);
  const frequencyArtefact = useSelector(getFrequencyArtefact);
  const { availableConstraints } = useSdmxAC();
  const availableBoundaries = getTimePeriodBoundaries(availableConstraints);
  const lastNMode = useSelector(getLastNMode);
  const [availableStart, availableEnd] = availableBoundaries;
  const dispatch = useDispatch();

  const prevState = useRef();
  const labels = R.mergeRight(
    R.reduce(
      (memo, [id, message]) => R.assoc(id, formatMessage(intl)(message), memo),
      {},
      R.toPairs(periodMessages),
    ),
  )(availableFrequencies);

  let [fixedStart, fixedEnd] = boundaries;
  fixedStart = fixedStart || availableStart;
  fixedEnd = fixedEnd || availableEnd;
  const refinedBoundaries = [
    fixedStart && availableStart && dateFns.isAfter(fixedStart, availableStart)
      ? availableStart
      : fixedStart,
    fixedEnd && availableEnd && dateFns.isBefore(fixedEnd, availableEnd)
      ? availableEnd
      : fixedEnd,
  ];

  const newPeriod = R.map((date) =>
    dateFns.compareAsc(date, availableStart) === -1 ||
    dateFns.compareDesc(date, availableEnd) === -1
      ? undefined
      : date,
  )(period);

  useEffect(() => {
    const action = {
      type: CHANGE_FREQUENCY_PERIOD,
      pushHistory: {
        pathname: '/vis',
        payload: { period: R.map(getSdmxPeriod(frequency))(newPeriod) },
      },
    };

    if (
      !R.equals(prevState.current?.availableBoundaries, availableBoundaries) &&
      !R.equals(prevState.current?.frequency, frequency) &&
      !R.isEmpty(availableBoundaries) &&
      !R.equals(lastNMode, LASTNPERIODS)
    ) {
      dispatch(action);
    }
    prevState.current = { frequency, availableBoundaries };
  }, [availableBoundaries, frequency]);

  return (
    <PeriodPicker
      period={period}
      availableFrequencies={R.keys(availableFrequencies)}
      availableBoundaries={availableBoundaries}
      boundaries={refinedBoundaries}
      isBlank={R.isNil(period)}
      labels={labels}
      frequencyDisabled={R.pipe(
        R.prop('display'),
        R.equals(false),
      )(frequencyArtefact)}
      defaultFrequency={frequency}
      changePeriod={changePeriod}
      changeFrequency={changeFrequency}
    />
  );
};

export default Period;
