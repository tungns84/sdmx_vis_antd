import Grid from '@mui/material/Grid';
import HelpIcon from '@mui/icons-material/EmojiObjects';
import { InputNumber, Mode } from '@sis-cc/dotstatsuite-visions';
import * as R from 'ramda';
import React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { formatMessage } from '../../i18n';
import { getHasLastNObservations } from '../../selectors/router';
import { LASTNOBSERVATIONS, LASTNPERIODS } from '../../utils/used-filter';
import messages from '../messages';

const LastNPeriod = ({ handleChange, handleChangeValue, lastNMode, value }) => {
  const intl = useIntl();
  const hasLastNObservations = useSelector(getHasLastNObservations);
  // const lastNMode = useSelector(getLastNMode);

  const modes = [
    {
      value: LASTNPERIODS,
      label: formatMessage(intl)(messages['periods']),
      popperLabel: formatMessage(intl)(messages.periodsPopperLabel),
      disabled: R.isEmpty(value) || R.isNil(value),
    },
    {
      value: LASTNOBSERVATIONS,
      label: formatMessage(intl)(messages['timeSeries']),
      popperLabel: formatMessage(intl)(messages.timeValuesPopperLabel),
      disabled: R.isEmpty(value) || R.isNil(value),
    },
  ];

  return hasLastNObservations ? (
    <Grid container>
      <Grid item sm={5}>
        <InputNumber
          beforeLabel={formatMessage(intl)(messages.beforeLabel)}
          value={value}
          onChange={handleChangeValue}
          ariaLabel={formatMessage(intl)(messages.lastNLabel, {
            value,
            mode: formatMessage(intl)(
              messages[
                R.equals(lastNMode, LASTNPERIODS) ? 'periods' : 'timeSeries'
              ],
            ),
          })}
        />
      </Grid>
      <Grid item sm={7}>
        <Mode modes={modes} mode={lastNMode} changeMode={handleChange}>
          <HelpIcon fontSize="small" />
        </Mode>
      </Grid>
    </Grid>
  ) : (
    <InputNumber
      beforeLabel={formatMessage(intl)(messages.beforeLabel)}
      value={value}
      onChange={handleChangeValue}
      afterLabel={formatMessage(intl)(messages['periods'])}
      popperLabel={formatMessage(intl)(messages.periodsPopperLabel)}
      ariaLabel={formatMessage(intl)(messages.lastNLabel, {
        value,
        mode: formatMessage(intl)(messages['periods']),
      })}
    />
  );
};

export default LastNPeriod;
