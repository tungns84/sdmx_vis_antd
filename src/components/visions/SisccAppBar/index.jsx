import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import * as R from 'ramda';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import LanguageIcon from '@mui/icons-material/Language';
import useMediaQuery from '@mui/material/useMediaQuery';
import Typography from '@mui/material/Typography';
import useTheme from '@mui/material/styles/useTheme';
import Link from '@mui/material/Link';
import { useIntl } from 'react-intl';
import { formatMessage, FormattedMessage } from '../../../i18n';
import { hasContactForm } from '../../../lib/settings';
import User from '../../user';
import Contact from '../../contact';
import AccessibilityButton from '../../AccessibilityButton';
import ReducedActionsMenu from './ReducedMenuActions';
import useStyles from './useStyles';
import { messages as i18nMessages } from '../../../i18n/messages';
import { useOidc } from '../../../lib/oidc/index';
import messages from '../../messages';

const Input = (id) => {
  const intl = useIntl();
  const classes = useStyles();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));

  if (isXs) {
    return (
      <React.Fragment>
        <LanguageIcon className={classes.value} color="primary" />
        {R.has(id, i18nMessages) ? formatMessage(intl)(i18nMessages[id]) : id}
      </React.Fragment>
    );
  }
  return (
    <span className={classes.value}>
      <LanguageIcon color="primary" />
      {R.has(id, i18nMessages) ? formatMessage(intl)(i18nMessages[id]) : id}
    </span>
  );
};

Input.propTypes = {
  id: PropTypes.string,
};

const Component = ({
  logo,
  locales,
  localeId,
  changeLocale,
  logoLink,
  isFixed,
}) => {
  const classes = useStyles();
  const intl = useIntl();
  const auth = useOidc();
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('md'));
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <AppBar
      data-testid="sisccappbar"
      position="static"
      className={cx(classes.appBar, { [classes.fixed]: isFixed })}
      elevation={0}
    >
      <Toolbar className={classes.toolBar}>
        <div className={classes.logoWrapper}>
          {logoLink ? (
            <Link href={logoLink} target="_blank" rel="noopener noreferrer">
              {' '}
              <img
                className={cx(classes.logo, classes.alternativeBrowserLogo)}
                src={logo}
                alt={formatMessage(intl)(messages['logoSiscc'])}
              />{' '}
            </Link>
          ) : (
            <img
              className={cx(classes.logo, classes.alternativeBrowserLogo)}
              src={logo}
              alt={formatMessage(intl)(messages['logoSiscc'])}
            />
          )}
        </div>
        {!R.isEmpty(R.path([localeId, 'de.header.message'])(window.I18N)) &&
          !isSm && (
            <>
              <Typography variant="body1" className={classes.headerTitle}>
                <FormattedMessage id="de.header.message" />
              </Typography>
              <Divider
                orientation="vertical"
                flexItem
                className={classes.divider}
              />
            </>
          )}
        {!isXs && (
          <React.Fragment>
            <AccessibilityButton />
            {auth && (
              <React.Fragment>
                <Divider
                  orientation="vertical"
                  flexItem
                  className={classes.divider}
                />
                <User />
              </React.Fragment>
            )}
            {hasContactForm && (
              <React.Fragment>
                <Divider
                  orientation="vertical"
                  flexItem
                  className={classes.divider}
                />
                <Contact />
              </React.Fragment>
            )}
            <Divider
              orientation="vertical"
              flexItem
              className={classes.divider}
            />
            <TextField
              select
              id="languages" // TextField should always have id (accessibility)
              className={classes.textField}
              value={localeId}
              variant="outlined"
              margin="dense"
              size="small"
              onChange={(event) => changeLocale(event.target.value)}
              inputProps={{
                renderValue: Input,
              }}
              SelectProps={{
                classes: {
                  select: classes.select,
                  iconOutlined: classes.arrowDown,
                },
              }}
            >
              {R.map((id) => (
                <MenuItem
                  key={id}
                  id={id}
                  value={id}
                  dense
                  className={classes.menuItem}
                >
                  <span>
                    {R.has(id, i18nMessages)
                      ? formatMessage(intl)(i18nMessages[id])
                      : id}
                  </span>
                </MenuItem>
              ))(locales)}
            </TextField>
          </React.Fragment>
        )}
        {isXs && (
          <ReducedActionsMenu
            localeId={localeId}
            locales={locales}
            changeLocale={changeLocale}
          />
        )}
      </Toolbar>
      {!R.isEmpty(R.path([localeId, 'de.header.message'])(window.I18N)) &&
        isSm && (
          <Toolbar className={classes.headerNote}>
            <Typography variant="body1" className={classes.headerTitle}>
              <FormattedMessage id="de.header.message" />
            </Typography>
          </Toolbar>
        )}
    </AppBar>
  );
};

Component.propTypes = {
  logo: PropTypes.string,
  locales: PropTypes.array.isRequired,
  localeId: PropTypes.string,
  changeLocale: PropTypes.func.isRequired,
  logoLink: PropTypes.string,
  isFixed: PropTypes.bool,
};

export default Component;
