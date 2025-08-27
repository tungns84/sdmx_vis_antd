import React from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import { defineMessages, useIntl } from 'react-intl';
import { formatMessage } from '../../../i18n';
import { Button, Menu } from './helpers';
import { toolbarMessages } from '../../messages';
import {
  DISPLAYS,
  DISPLAY_BOTH,
  DISPLAY_CODE,
  DISPLAY_LABEL,
} from '../../../utils/constants';

const messages = defineMessages({
  [DISPLAY_LABEL]: { id: 'vx.config.display.label' },
  [DISPLAY_CODE]: { id: 'vx.config.display.code' },
  [DISPLAY_BOTH]: { id: 'vx.config.display.both' },
});

const Component = ({ label, changeLabel }) => {
  const intl = useIntl();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const itemClick =
    (onClickHandler, ...args) =>
    () => {
      if (R.is(Function)(onClickHandler)) onClickHandler(...args);
      closeMenu();
    };

  return (
    <React.Fragment>
      <Button
        startIcon={<LocalOfferOutlinedIcon />}
        onClick={openMenu}
        aria-haspopup="true"
        selected={Boolean(anchorEl)}
        aria-expanded={Boolean(anchorEl)}
        isToolTip
      >
        {formatMessage(intl)(toolbarMessages.labels)}
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
        {R.map((id) => (
          <MenuItem
            key={id}
            onClick={itemClick(changeLabel, id)}
            selected={R.equals(label, id)}
            dense
            aria-labelledby={id}
            aria-checked={R.equals(label, id)}
          >
            <ListItemText id={id} primaryTypographyProps={{ color: 'primary' }}>
              <span>{formatMessage(intl)(messages[id])}</span>
            </ListItemText>
          </MenuItem>
        ))(DISPLAYS)}
      </Menu>
    </React.Fragment>
  );
};

Component.propTypes = {
  changeLabel: PropTypes.func.isRequired,
  label: PropTypes.string,
};

export default Component;
