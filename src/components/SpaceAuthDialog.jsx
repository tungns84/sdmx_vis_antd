import React from 'react';
import PropTypes from 'prop-types';
import { AuthDialog } from '@sis-cc/dotstatsuite-visions';
import { FormattedMessage } from '../i18n';
import { useDispatch } from 'react-redux';
import { setExtAuthOptions } from '../ducks/app';

const SpaceAuthDialog = ({ datasource = {}, hasFailed }) => {
  const dispatch = useDispatch();

  return (
    <AuthDialog
      isOpen={true}
      labels={{
        anonymous: <FormattedMessage id="space.auth.anonymous" />,
        error: hasFailed ? <FormattedMessage id="space.auth.failed" /> : null,
        header: (
          <FormattedMessage
            id="space.auth.header"
            values={{ space: datasource.label }}
          />
        ),
        password: <FormattedMessage id="space.auth.password" />,
        user: <FormattedMessage id="space.auth.user" />,
        submit: <FormattedMessage id="space.auth.login" />,
      }}
      onSubmit={(options) =>
        dispatch(setExtAuthOptions(datasource.id, options))
      }
    />
  );
};

SpaceAuthDialog.propTypes = {
  datasource: PropTypes.object,
  hasFailed: PropTypes.bool,
};

export default SpaceAuthDialog;
