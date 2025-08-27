import React, { useState } from 'react';
import cx from 'classnames';
import * as R from 'ramda';
import makeStyles from '@mui/styles/makeStyles';
import Button from '@mui/material/Button';
import debounce from '../../utils/debounce';
import useEventListener from '../../utils/useEventListener';

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: '100%',
    minWidth: 0,
    backgroundColor: '#0549ab47',
    padding: theme.spacing(1, 2),
    zIndex: 10,
  },
  rotate: {
    transform: 'rotate(90deg)',
  },
  scrollLeftButton: {
    position: 'fixed',
    bottom: 65,
    right: 70,
  },
  scrollTopButton: {
    position: 'fixed',
    bottom: 65,
    right: 16,
  },
  display: {
    display: 'none',
  },
}));

const ScrollToButtons = () => {
  const classes = useStyles();

  const [scrollsPos, setScrollsPos] = useState({
    scrollY: 0,
    scrollX: 0,
  });

  const scrollHandler = () => {
    setScrollsPos({
      scrollY: window.scrollY,
      scrollX: window.scrollX,
    });
  };

  useEventListener('scroll', debounce(scrollHandler, 100));

  return (
    <>
      {R.map(
        ({ className, rotate, action, isDisplayed }) => (
          <Button
            key={className}
            variant="contained"
            color="primary"
            component="span"
            className={cx(className, { [classes.display]: isDisplayed })}
            classes={{ root: classes.root }}
            onClick={action}
          >
            <span className={rotate}>«</span>
          </Button>
        ),
        [
          {
            className: classes.scrollTopButton,
            rotate: classes.rotate,
            action: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
            isDisplayed: scrollsPos.scrollY === 0,
          },
          {
            className: classes.scrollLeftButton,
            action: () => window.scrollTo({ left: 0, behavior: 'smooth' }),
            isDisplayed: scrollsPos.scrollX === 0,
          },
        ],
      )}
    </>
  );
};

export default ScrollToButtons;
