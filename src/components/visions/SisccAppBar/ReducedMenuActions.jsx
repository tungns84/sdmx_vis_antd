import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import * as R from 'ramda';
import {
  AccessibilityFilled,
  AccessibilityOutlined,
  AccountFilled,
  AccountOutlined,
} from '@sis-cc/dotstatsuite-visions';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import LanguageIcon from '@mui/icons-material/Language';
import { useIntl } from 'react-intl';
import { formatMessage, FormattedMessage } from '../../../i18n';
import { hasContactForm } from '../../../lib/settings';
import Contact from '../../contact';
import { getHasAccessibility } from '../../../selectors/router';
import { getUser } from '../../../selectors/app.js';
import { changeHasAccessibility } from '../../../ducks/app';
import useStyles from './useStyles';
import messages from '../../messages';
import { messages as i18nMessages } from '../../../i18n/messages';
import { useOidc, userSignIn } from '../../../lib/oidc/index';

const ReducedActionsMenu = ({ locales, localeId, changeLocale }) => {
  const intl = useIntl();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [expandedLocales, setExpandedLocales] = React.useState(false);
  const dispatch = useDispatch();
  const hasAccessibility = useSelector(getHasAccessibility);
  const auth = useOidc();
  const user = useSelector(getUser);
  const classes = useStyles();

  const AccessibilityIcon = hasAccessibility
    ? AccessibilityFilled
    : AccessibilityOutlined;

  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const closeMenu = () => {
    setAnchorEl(null);
    setExpandedLocales(false);
  };
  return (
    <React.Fragment>
      <IconButton className={classes.reducedMenu} onClick={openMenu}>
        <MenuIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        transitionDuration={{ exit: 0 }}
      >
        {!expandedLocales && (
          <MenuItem
            className={classes.reducedMenuItem}
            onClick={() => dispatch(changeHasAccessibility(!hasAccessibility))}
          >
            <ListItemIcon
              aria-label={
                hasAccessibility
                  ? formatMessage(intl)(messages.accessibilitySupportEnabled)
                  : formatMessage(intl)(messages.accessibilitySupportDisabled)
              }
              aria-pressed={hasAccessibility}
              className={classes.reducedMenuIcon}
            >
              <AccessibilityIcon color="primary" />
            </ListItemIcon>
            <ListItemText>
              {formatMessage(intl)(messages.accessibilitySupport)}
            </ListItemText>
          </MenuItem>
        )}
        {auth && !expandedLocales && (
          <React.Fragment>
            <Divider />
            <MenuItem
              onClick={() => (user ? auth.signOut() : userSignIn(auth))}
            >
              <ListItemIcon
                className={classes.reducedMenuIcon}
                aria-label={formatMessage(intl)(
                  user ? messages.userLogout : messages.userLogin,
                )}
              >
                {user ? (
                  <AccountFilled color="primary" />
                ) : (
                  <AccountOutlined color="primary" />
                )}
              </ListItemIcon>
              <ListItemText>
                {user ? (
                  <FormattedMessage id="user.logout" />
                ) : (
                  <FormattedMessage id="user.login" />
                )}
              </ListItemText>
            </MenuItem>
          </React.Fragment>
        )}
        {hasContactForm && !expandedLocales && (
          <React.Fragment>
            <Divider />
            <Contact />
          </React.Fragment>
        )}
        {!expandedLocales && (
          <React.Fragment>
            <Divider />
            <MenuItem
              className={classes.reducedMenuItem}
              onClick={() => setExpandedLocales(!expandedLocales)}
            >
              <ListItemIcon className={classes.reducedMenuIcon}>
                <LanguageIcon color="primary" />
              </ListItemIcon>
              <ListItemText>
                {R.has(localeId, i18nMessages)
                  ? formatMessage(intl)(i18nMessages[localeId])
                  : localeId}
              </ListItemText>
            </MenuItem>
          </React.Fragment>
        )}
        {expandedLocales &&
          R.map((id) => (
            <MenuItem
              key={id}
              id={id}
              value={id}
              dense
              selected={id === localeId}
              className={classes.reducedMenuItem}
              onClick={() => {
                changeLocale(id);
                closeMenu();
              }}
            >
              {R.has(id, i18nMessages)
                ? formatMessage(intl)(i18nMessages[id])
                : id}
            </MenuItem>
          ))(locales)}
      </Menu>
    </React.Fragment>
  );
};

ReducedActionsMenu.propTypes = {
  locales: PropTypes.array.isRequired,
  localeId: PropTypes.string,
  changeLocale: PropTypes.func.isRequired,
};

export default ReducedActionsMenu;
