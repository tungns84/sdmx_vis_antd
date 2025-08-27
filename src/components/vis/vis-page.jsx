import React, { useRef, useLayoutEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import Page from '../Page';
import { getIsFull } from '../../selectors';
import { getAppBarsOffset } from '../../selectors/app.js';
import { MARGE_SIZE } from '../../utils/constants';
import { ID_VIS_PAGE } from '../../css-api';
import { updateVisPageWidth } from '../../ducks/app';
import useEventListener from '../../utils/useEventListener';
import debounce from '../../utils/debounce';

const useStyles = makeStyles((theme) => ({
  page: {
    overflow: 'visible',
    backgroundColor: theme.palette.background.default,
    padding: `0 ${MARGE_SIZE}%`,
    zIndex: 1,
    [theme.breakpoints.down('xs')]: {
      padding: '0 16px 0',
    },
  },
}));

const VisPage = ({ children }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const ref = useRef(null);
  const appBarsOffset = useSelector(getAppBarsOffset);
  const isFull = useSelector(getIsFull());
  const styles = { marginTop: isFull ? 0 : appBarsOffset };

  const handler = () => {
    if (ref.current) {
      dispatch(updateVisPageWidth(ref.current.offsetWidth));
    }
  };

  useEventListener('resize', debounce(handler, 100));
  useLayoutEffect(handler, []); // first render

  return (
    <Page
      id={ID_VIS_PAGE}
      classNames={[classes.page]}
      styles={styles}
      ref={ref}
    >
      {children}
    </Page>
  );
};

export default VisPage;
