import React from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import { formatMessage } from '../../../i18n';
import { visDlMessages } from '../../messages';

const ActionButton = React.forwardRef(
  ({ id, disabled, onClick, intl }, ref) => {
    return (
      <MenuItem
        data-testid={`${id}-button`}
        ref={ref}
        onClick={onClick}
        dense
        disabled={!!disabled || !R.is(Function, onClick)}
        aria-labelledby={id}
        tabIndex={0}
      >
        <ListItemText primaryTypographyProps={{ color: 'primary' }}>
          <span>{formatMessage(intl)(visDlMessages[id])}</span>
        </ListItemText>
      </MenuItem>
    );
  },
);
ActionButton.propTypes = {
  id: PropTypes.string,
  disabled: PropTypes.bool,
  intl: PropTypes.object,
  onClick: PropTypes.func,
};

export default ActionButton;
