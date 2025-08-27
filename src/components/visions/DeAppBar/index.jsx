import React from 'react';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import cx from 'classnames';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import { Tooltip } from '@sis-cc/dotstatsuite-visions';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import ButtonBase from '@mui/material/ButtonBase';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import useStyles from './useStyles';
import { getIsRtl } from '../../../selectors/router';
import { ID_APPBAR } from '../../../css-api';
import { formatMessage } from '../../../i18n';
import messages from '../../messages';
import { getApp, getLocaleId } from '../../../lib/settings';

const Component = ({
  logo,
  goHome,
  goBack,
  goBackLabel,
  children,
  isFixed,
}) => {
  const classes = useStyles();
  const isRtl = useSelector(getIsRtl);
  const localeId = useSelector(getLocaleId);
  const intl = useIntl();
  const logoLink = getApp('logoLink', localeId);
  return (
    <div className={cx({ [classes.fixed]: isFixed })} id={ID_APPBAR}>
      <AppBar
        data-testid="deappbar"
        position="static"
        className={classes.appBar}
        elevation={0}
      >
        <Toolbar className={classes.toolBar} sx={{ minHeight: 64 }}>
          <div className={classes.logoWrapper}>
            <Tooltip
              variant="light"
              tabIndex={0}
              aria-label={formatMessage(intl)(messages.goHome)}
              aria-hidden={false}
              placement="bottom-start"
              title={
                R.isEmpty(
                  R.path([localeId, messages.goHome.id])(window.I18N),
                ) ? (
                  ''
                ) : (
                  <Typography id="deAppBar" variant="body2">
                    {formatMessage(intl)(messages.goHome)}
                  </Typography>
                )
              }
            >
              {!R.isEmpty(logoLink) && !R.isNil(logoLink) ? (
                <Link href={logoLink} rel="noopener noreferrer">
                  <img
                    className={cx(classes.logo, classes.alternativeBrowserLogo)}
                    src={logo}
                    alt={formatMessage(intl)(messages.logoDe)}
                  />
                </Link>
              ) : (
                <ButtonBase disableRipple onClick={goHome}>
                  <img
                    className={cx(classes.logo, classes.alternativeBrowserLogo)}
                    src={logo}
                    alt={formatMessage(intl)(messages.logoDe)}
                  />
                </ButtonBase>
              )}
            </Tooltip>
          </div>
          {children}
        </Toolbar>
      </AppBar>
      {R.is(Function, goBack) && (
        <Toolbar variant="dense" className={classes.toolBar}>
          <Link
            data-testid="back-search-link"
            underline="none"
            classes={{ underlineNone: classes.backLink }}
            component="button"
            onClick={goBack}
            variant="body2"
            color="textSecondary"
          >
            {isRtl ? (
              <ArrowForwardIosIcon className={classes.backIcon} />
            ) : (
              <ArrowBackIosIcon className={classes.backIcon} />
            )}
            {goBackLabel}
          </Link>
        </Toolbar>
      )}
    </div>
  );
};

Component.propTypes = {
  isFixed: PropTypes.bool,
  logo: PropTypes.string,
  goHome: PropTypes.func.isRequired,
  goBack: PropTypes.func,
  goBackLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.node]),
};

export default Component;
