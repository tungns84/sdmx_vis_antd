import React, { useRef, useEffect } from 'react';
import { useLocation } from 'react-router';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import useSize from '@react-hook/size';
import * as R from 'ramda';
import Grid from '@mui/material/Grid';
import makeStyles from '@mui/styles/makeStyles';
import Footer from './footer';
import { updateAppBarsOffset } from '../ducks/app';
// import { isAuthRequired } from '../lib/settings';
import { getIsFull } from '../selectors';
// import { useOidc, userSignIn } from '../lib/oidc';
import Page from './Page';
import { getUser } from '../selectors/app.js';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { FormattedMessage } from '../i18n/index';
import AppBars from './AppBars';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
  },
  content: {
    flexGrow: 1,
  },
  footerContainer: {
    zIndex: 0,
  },
  wrapper: {
    padding: theme.spacing(8),
  },
}));

const Component = ({ children }) => {
  const classes = useStyles();
  const isFull = useSelector(getIsFull());

  // const auth = useOidc();
  // const user = useSelector(getUser);
  const location = useLocation();
  const isTsDemo = location?.pathname?.startsWith('/ts-demo');

  const dispatch = useDispatch();
  const appBarsRef = useRef(null);
  const [, appBarsHeight] = useSize(appBarsRef);

  useEffect(() => {
    dispatch(updateAppBarsOffset(appBarsHeight));
  }, [appBarsHeight]);

  return (
    <Grid container wrap="nowrap" direction="column" className={classes.root}>
      <Grid item>
        <AppBars ref={appBarsRef} />
      </Grid>
      {/* Auth disabled - always show children */}
      {children}
      {R.not(isFull) && (
        <Grid item className={classes.footerContainer}>
          <Footer />
        </Grid>
      )}
    </Grid>
  );
};

Component.propTypes = {
  children: PropTypes.node,
};

export default Component;
