import React, { useState, useEffect } from 'react';
import * as R from 'ramda';
import { useSelector } from 'react-redux';
import useTheme from '@mui/material/styles/useTheme';
import Typography from '@mui/material/Typography';
import { defineMessages, useIntl } from 'react-intl';
import { FormattedMessage, formatMessage } from '../../i18n';
import Form from './Form';
import { requestToken } from '../reducer';
import { getLog, getIsPending } from '../accessors';
import messages from '../../components/messages';
import { getAsset } from '../../lib/settings';
import { getLocale } from '../../selectors/router';
import { expirationPeriod } from '../../utils/constants';

export const expiredMessages = defineMessages({
  success: { id: 'de.share.expired.token.success' },
  email: { id: 'de.share.expired.label' },
});

const ExpiredToken = ({ email, state, dispatch }) => {
  const intl = useIntl();
  const isPending = getIsPending('getEmail')(state);
  const logList = getLog('getEmail', 'method')(state);
  const theme = useTheme();
  const localeId = useSelector(getLocale);

  const [isDisabled, setDisabled] = useState(isPending);
  const [notification, setNotification] = useState({});

  useEffect(() => {
    if (isPending) setDisabled(true);
  }, [isPending]);

  useEffect(() => {
    if (logList) {
      const isSuccess = logList?.log?.statusCode == 200;
      setNotification({
        open: true,
        severity: isSuccess ? 'success' : 'error',
        message: isSuccess
          ? intl.formatMessage(expiredMessages.success)
          : logList?.message || 'Network error',
      });
    }
  }, [logList]);
  const logo = getAsset('mailHeader', localeId);
  // const title = R.pathOr('Confirm your email- Expired token', ['headerProps', 'title', 'label'], viewerProps);

  let body = {
    subject: formatMessage(intl)(messages.subject, {
      title: 'Confirm your email- Expired token',
    }),
    content: {
      headerMsg: formatMessage(intl)(messages.headerMsg),
      subHeaderMsg: formatMessage(intl)(messages.subHeaderMsg),
      copyMsg: formatMessage(intl)(messages.copyMsg),
      confirmationText: formatMessage(intl)(messages.confirmationText, {
        chartsTTL: expirationPeriod,
      }),
      buttonMsg: formatMessage(intl)(messages.buttonMsg),
    },
    css: {
      banner: theme.palette.tertiary.main,
      body: theme.palette.secondary.dark,
      button: theme.palette.primary.dark,
    },
  };
  if (!R.isNil(logo) && !R.isEmpty(logo)) {
    body.logo = R.concat(window.location.origin, logo);
  }

  return (
    <>
      <Typography component="label" variant="body2">
        <FormattedMessage id="de.share.expired.description" />
      </Typography>
      <Form
        email={email}
        action={(email) => dispatch(requestToken({ ...body, email })(dispatch))}
        isDisabled={isDisabled}
        notification={notification}
        closeNotificationPanel={() =>
          setNotification(R.set(R.lensProp('open'), false))
        }
        isPending={isPending}
        labels={{
          submit: <FormattedMessage id="de.share.expired.submit" />,
          email: intl.formatMessage(expiredMessages.email),
        }}
      />
    </>
  );
};

export default ExpiredToken;
