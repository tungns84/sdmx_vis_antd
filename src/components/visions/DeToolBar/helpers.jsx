import React from 'react';
import * as R from 'ramda';
import PropTypes from 'prop-types';
import makeStyles from '@mui/styles/makeStyles';
import { Tooltip, VerticalButton } from '@sis-cc/dotstatsuite-visions';
import useMediaQuery from '@mui/material/useMediaQuery';
import MuiMenu from '@mui/material/Menu';
import Typography from '@mui/material/Typography';

const useStyles = makeStyles((theme) => ({
  button: {
    padding: theme.spacing(0.5, 0.5),
    [theme.breakpoints.down('lg')]: {
      minWidth: '48px !important',
    },
    [theme.breakpoints.down('sm')]: {
      minWidth: '36px !important',
    },
  },
}));

export const Button = ({ children, isToolTip, ...props }) => {
  const classes = useStyles();
  const isSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const isMD = useMediaQuery((theme) => theme.breakpoints.only('md'));

  return (
    <Tooltip
      variant="light"
      tabIndex={0}
      aria-label={
        isToolTip && R.is(String)(children) && (isSM || isMD) ? children : ''
      }
      aria-hidden={false}
      placement="top"
      PopperProps={{
        modifiers: [
          {
            name: 'flip',
            options: {
              fallbackPlacements: ['top', 'bottom', 'right', 'left'],
            },
          },
        ],
      }}
      title={
        isToolTip && (isSM || isMD) ? (
          <Typography id="devisLabels" variant="body2">
            {children}
          </Typography>
        ) : (
          ''
        )
      }
    >
      <VerticalButton className={classes.button} color="primary" {...props}>
        {isToolTip && (isSM || isMD) ? null : children}
      </VerticalButton>
    </Tooltip>
  );
};

Button.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  isToolTip: PropTypes.bool,
};

export const Menu = (props) => (
  <MuiMenu
    keepMounted
    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    transformOrigin={{ vertical: 'top', horizontal: 'center' }}
    {...props}
  >
    {props.children}
  </MuiMenu>
);

Menu.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
};
