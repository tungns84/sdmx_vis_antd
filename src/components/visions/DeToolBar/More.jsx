import React from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import makeStyles from '@mui/styles/makeStyles';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MenuItem from '@mui/material/MenuItem';
import DeveloperModeOutlinedIcon from '@mui/icons-material/DeveloperModeOutlined';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import { FormattedMessage } from '../../../i18n';
import { Button, Menu } from './helpers';

const API = 'api';

const useStyles = makeStyles((theme) => ({
  icon: {
    minWidth: theme.spacing(4),
  },
}));

const Component = ({ actionId, changeActionId }) => {
  const classes = useStyles();
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
        startIcon={<MoreVertIcon />}
        selected={R.or(R.includes(actionId, [API]), Boolean(anchorEl))}
        onClick={openMenu}
        aria-haspopup="true"
        aria-pressed={R.or(R.includes(actionId, [API]), Boolean(anchorEl))}
      >
        <FormattedMessage id="de.visualisation.toolbar.action.more" />
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
        <MenuItem
          onClick={itemClick(changeActionId, API)}
          aria-expanded={R.equals(actionId, API)}
          dense
          aria-labelledby={actionId}
        >
          <ListItemIcon className={classes.icon}>
            <DeveloperModeOutlinedIcon fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText
            id={actionId}
            primaryTypographyProps={{ color: 'primary' }}
          >
            <FormattedMessage id="de.visualisation.toolbar.action.apiqueries" />
          </ListItemText>
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
};

Component.propTypes = {
  actionId: PropTypes.string,
  changeActionId: PropTypes.func.isRequired,
};

export default Component;
