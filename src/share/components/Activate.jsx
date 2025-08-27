import React from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import Typography from '@mui/material/Typography';
import { Button } from '@sis-cc/dotstatsuite-visions';
import { defineMessages, useIntl } from 'react-intl';
import { formatMessage, FormattedMessage } from '../../i18n';
import { requestConfirm } from '../reducer';

export const activateMessages = defineMessages({
  confirmEmail: { id: 'de.share.activate.submit' },
  appTitle: { id: 'de.app.title.search' },
});

export const Activate = ({ token, isDisabled, dispatch }) => {
  const intl = useIntl();

  return (
    <>
      <Typography variant="h6">
        <FormattedMessage id="de.share.activate.title" />
      </Typography>
      <Button
        fullWidth
        disabled={R.isNil(token) || isDisabled}
        onClick={() => dispatch(requestConfirm(token)(dispatch))}
        aria-label={formatMessage(intl)(activateMessages.confirmEmail)}
        color="primary"
        variant="contained"
        alternative="siscc"
      >
        <Typography variant="body2">
          <FormattedMessage id="de.share.activate.submit" />
        </Typography>
      </Button>
    </>
  );
};

Activate.propTypes = {
  token: PropTypes.string,
  isDisabled: PropTypes.bool,
  dispatch: PropTypes.func,
};

export default Activate;
