import React from 'react';
import { useIntl } from 'react-intl';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';
import {
  AccountFilled,
  AccountOutlined,
  Tooltip,
} from '@sis-cc/dotstatsuite-visions';
import { FormattedMessage, formatMessage } from '../i18n';
import { Menu } from './visions/DeToolBar/helpers';
import messages from './messages';
import { getUser } from '../selectors/app.js';
import { useOidc, userSignIn } from '../lib/oidc';
import useTooltip from '../hooks/useTooltip';

const User = () => {
  const intl = useIntl();
  const auth = useOidc();
  const user = useSelector(getUser);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const isOpen = Boolean(anchorEl);
  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const closeMenu = () => {
    setAnchorEl(null);
  };
  const userSignOut = () => {
    closeMenu();
    auth && auth.signOut();
  };
  const { open, onOpen, onClose } = useTooltip();

  if (!auth) return null;
  if (!user) {
    return (
      <Tooltip
        placement="bottom"
        variant="light"
        open={open}
        onOpen={onOpen}
        onClose={onClose}
        title={<FormattedMessage id="user.login" />}
      >
        <IconButton
          aria-label={formatMessage(intl)(messages.userLogin)}
          aria-pressed={isOpen}
          onClick={() => userSignIn(auth)}
          size="large"
        >
          <AccountOutlined color="primary" />
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <React.Fragment>
      <IconButton
        onClick={openMenu}
        aria-label={formatMessage(intl)(messages.userLogin)}
        aria-expanded={isOpen}
        size="large"
      >
        <AccountFilled color="primary" />
      </IconButton>
      <Menu anchorEl={anchorEl} open={isOpen} onClose={closeMenu}>
        <MenuItem>
          <Typography variant="body2" color="textPrimary">
            {user.given_name} {user.family_name}
          </Typography>
        </MenuItem>
        <MenuItem>
          <Typography variant="body2" color="textPrimary">
            {user.email}
          </Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={userSignOut}>
          <Typography variant="body2" color="primary">
            <FormattedMessage id="user.logout" />
          </Typography>
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
};

export default User;
