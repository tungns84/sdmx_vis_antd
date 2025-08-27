import React, { useLayoutEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import Typography from '@mui/material/Typography';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import makeStyles from '@mui/styles/makeStyles';
import useMediaQuery from '@mui/material/useMediaQuery';
import cx from 'classnames';
import * as R from 'ramda';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';
import { useSelector } from 'react-redux';
import { FormattedMessage, formatMessage } from '../i18n';
import { MARGE_RATIO } from '../utils/constants';
import { getIsFull } from '../selectors';
import { getIsMicrodata } from '../selectors/microdata';
import AppliedFilters from './vis-side/applied-filters';
import { ClearFilters } from './vis-side/used-filter';
import messages from './messages';
import useGetUsedFilters from '../hooks/useGetUsedFilters';
import useMaxWidth from '../hooks/useMaxWidth';
import { getIsRtl } from '../selectors/router';

const useStyles = makeStyles((theme) => ({
  usedFilterslabel: {
    paddingRight: 5,
    fontFamily: 'Roboto Slab, serif',
    fontSize: '17px',
    color: 'Body !important',
    textWrap: 'wrap',
  },
  expandIcon: {
    color: theme.palette.primary.main,
  },
  toolbar: {
    position: 'sticky',
  },
  title: {
    width: 'auto',
    flexShrink: 0,
    paddingRight: '5px',
  },
  fading: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 75,
    margin: 0,
    padding: 0,
    backgroundImage: 'linear-gradient(to bottom, transparent, white)',
  },
}));

const UsedFilters = ({
  counter,
  maxWidth,
  data,
  labels = {},
  onDeleteAll,
  clearAllLabel,
  dataCount,
  dataCountId,
  dataCountLabel,
}) => {
  const intl = useIntl();
  const isMicrodata = useSelector(getIsMicrodata);
  const selection = useGetUsedFilters();
  const isRtl = useSelector(getIsRtl);
  const isNarrow = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const isFull = useSelector(getIsFull());
  const classes = useStyles();
  const maxWidthStyles = useMaxWidth({
    visWidth: maxWidth ? maxWidth - maxWidth * (1 - MARGE_RATIO) : '100%',
    isFull: R.or(isFull, isMicrodata),
  });
  const collapsedSize = 29 * 2.5;
  const [open, setOpen] = React.useState(false);
  const [showExpandIcon, setShowExpandIcon] = useState(false);
  const filtersRef = useRef(null);
  const handleClick = () => setOpen(!open);

  useLayoutEffect(() => {
    function checkFiltersHeight() {
      const filtersElement = filtersRef.current;
      if (!filtersElement) return;
      const lineHeight = parseInt(
        getComputedStyle(filtersElement).getPropertyValue('line-height'),
      );
      const filtersHeight = filtersElement.scrollHeight;
      const numLines = Math.round(filtersHeight / lineHeight);
      setShowExpandIcon(numLines > 2);
    }
    checkFiltersHeight();

    window.addEventListener('resize', checkFiltersHeight);

    return () => {
      window.removeEventListener('resize', checkFiltersHeight);
    };
  }, [filtersRef.current, selection]);

  return (
    <Grid
      container
      direction={'column'}
      justifyContent="flex-start"
      wrap="nowrap"
      className={cx(classes.usedFilters, classes.toolbar)}
      style={{
        ...maxWidthStyles,
        marginTop: isFull || isNarrow ? 0 : -25,
      }}
      tabIndex={0}
      aria-label={formatMessage(intl)(messages.titleLabel, { counter })}
      id={dataCountId}
    >
      <Grid
        item
        container
        justifyContent="flex-start"
        wrap="nowrap"
        sx={{
          '&:hover': {
            cursor: showExpandIcon && 'pointer',
          },
        }}
        onClick={handleClick}
        className={classes.title}
        tabIndex={0}
      >
        {showExpandIcon && (
          <Grid item>
            <IconButton
              tabIndex={0}
              style={
                isRtl
                  ? { left: isNarrow ? 0 : 8, padding: 4 }
                  : { right: isNarrow ? 0 : 8, padding: 4 }
              }
              size="small"
              color="primary"
              aria-expanded={open}
              aria-label={formatMessage(intl)(messages.next)}
            >
              {' '}
              {open ? (
                <ExpandLess style={{ float: 'right' }} />
              ) : (
                <ExpandMore />
              )}
            </IconButton>
          </Grid>
        )}

        <Typography
          noWrap
          variant="body2"
          // tabIndex={0}
          className={classes.usedFilterslabel}
        >
          {!R.isNil(dataCount) ? (
            dataCountLabel
          ) : (
            <FormattedMessage id="vx.filters.current.title" />
          )}
        </Typography>
      </Grid>
      <Grid
        item
        style={
          showExpandIcon
            ? isRtl
              ? { marginRight: 25 }
              : { marginLeft: 25 }
            : { margin: 0 }
        }
      >
        <Collapse in={open} timeout="auto" collapsedSize={collapsedSize}>
          <Grid>
            <AppliedFilters ref={filtersRef} data={data} labels={labels} />
            <ClearFilters onDelete={onDeleteAll} label={clearAllLabel} />
          </Grid>
          {!open && showExpandIcon && (
            <div
              className={classes.fading}
              style={{
                top: collapsedSize - 24,
                pointerEvents: 'none',
              }}
            />
          )}
        </Collapse>
      </Grid>
    </Grid>
  );
};

export default UsedFilters;
