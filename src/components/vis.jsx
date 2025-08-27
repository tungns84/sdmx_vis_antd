import React from 'react';
import * as R from 'ramda';
import { useSelector } from 'react-redux';
import { Loading, NoData } from '../lib/dotstatsuite-antd/components/basic';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Grid';
import { visuallyHidden } from '@mui/utils';
import FiltersHelp from './filters-help';
import { FormattedMessage } from '../i18n';
import { getIsFull } from '../selectors';
import { getExtAuthOptions, getVisPageWidth } from '../selectors/app.js';
import { getIsMicrodata } from '../selectors/microdata';
import { getDataflow } from '../selectors/router';
import Side from './vis-side';
import NarrowFilters from './vis-side/side-container';
import { ID_VIS_PAGE } from '../css-api';
import ScrollToButtons from './vis/ScrollToButtons';
import {
  MARGE_RATIO,
  MARGE_SIZE,
  SIDE_WIDTH,
  SMALL_SIDE_WIDTH,
} from '../utils/constants';
import useSdmxStructure from '../hooks/useSdmxStructure';
import { getDatasource } from '../selectors/sdmx';
import SpaceAuthDialog from './SpaceAuthDialog';
import useSdmxACForFrequency from '../hooks/sdmx/useSdmxACForFrequency';
import useSdmxACForTimePeriod from '../hooks/sdmx/useSdmxACForTimePeriod';
import VisPage from './vis/vis-page';
import VisSurvey from './vis-survey';
import VisDataPoints from './vis-data-points';
import VisUserFilters from './vis-used-filters';
import VisData from './vis-data';

const useStyles = makeStyles((theme) => ({
  gutters: {
    display: 'flex',
    margin: 0,
    flexWrap: 'nowrap',
    backgroundColor: theme.palette.background.default,
    marginRight: '-15px',
    [theme.breakpoints.down('sm')]: {
      marginRight: 0,
    },
    [theme.breakpoints.down('md')]: {
      flexWrap: 'wrap',
    },
  },
  visContainer: {
    marginTop: theme.spacing(-2.5),
    paddingTop: theme.spacing(2.5),
    backgroundColor: theme.palette.background.default,
  },
  space: {
    position: 'sticky',
    left: 0,
    backgroundColor: 'red',
  },
  usedFilterslabel: {
    paddingRight: 5,
    color: theme.palette.grey[700],
    ...R.pathOr({}, ['mixins', 'expansionPanel', 'title'], theme),
  },
  side: {
    backgroundColor: theme.palette.background.default,
    [theme.breakpoints.down('md')]: {
      width: '100%',
      position: 'sticky',
      '&::after': {
        content: '""',
        position: 'absolute',
        backgroundColor: theme.palette.background.default,
        top: '0',
        left: `-${MARGE_SIZE + 3}%`,
        width: `${MARGE_SIZE + 3}%`,
        height: '100%',
      },
      '&::before': {
        content: '""',
        position: 'absolute',
        backgroundColor: theme.palette.background.default,
        top: '0',
        right: `-${MARGE_SIZE + 3}%`,
        width: `${MARGE_SIZE + 3}%`,
        height: '100%',
      },
    },
    [theme.breakpoints.only('md')]: {
      zIndex: 1000,
      backgroundColor: theme.palette.background.default,
      marginRight: theme.spacing(2),
      minWidth: SMALL_SIDE_WIDTH,
      maxWidth: SMALL_SIDE_WIDTH,
    },
    [theme.breakpoints.up('lg')]: {
      backgroundColor: theme.palette.background.default,

      zIndex: 1000,
      marginRight: theme.spacing(2),
      minWidth: SIDE_WIDTH,
      maxWidth: SIDE_WIDTH,
    },
    marginBottom: theme.spacing(2.5),
  },
  tabPanel: {
    backgroundColor: theme.palette.background.default,
    position: 'absolute',
    top: '176px',
    zIndex: 1000,
    height: 'calc(100% - 64px - 176px)',
    boxShadow: '1em 0em 0.4em rgba(0,0,0,0.10)',
    width: 479.6,
    flex: 1,
    overflow: 'auto',
    left: `calc(${SIDE_WIDTH}px + ${MARGE_SIZE}%)`,

    // boxShadow: "0px 0px 2px 0px rgba(0,0,0,0.0), 2px 0px 0px 2px rgba(0,0,0,0.10), 10px 0px 0px 10px rgba(0,0,0,0.12)",

    [theme.breakpoints.only('md')]: {
      marginRight: theme.spacing(2),
      left: `calc(${SMALL_SIDE_WIDTH}px + ${MARGE_SIZE}%)`,
      width: 479.6,
    },
    [theme.breakpoints.up('lg')]: {
      marginRight: theme.spacing(2),
      left: `calc(${SIDE_WIDTH}px + ${MARGE_SIZE}%)`,
      width: 479.6,
    },
  },
  tabPanelNarrow: {
    backgroundColor: theme.palette.background.default,
    zIndex: 1000,
    left: '0px',
    width: '80vw',
    '&::after': {
      content: '""',
      position: 'absolute',
      backgroundColor: theme.palette.background.default,
      left: `-${MARGE_SIZE + 3}%`,
      height: '100%',
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      backgroundColor: theme.palette.background.default,
      top: '0',
      right: `-${MARGE_SIZE + 3}%`,
      height: '100%',
    },
  },
}));

const Vis = () => {
  const theme = useTheme();
  const isNarrow = useMediaQuery(theme.breakpoints.down('md'));
  const isFull = useSelector(getIsFull());
  const isMicrodata = useSelector(getIsMicrodata);
  const visPageWidth = useSelector(getVisPageWidth);
  const classes = useStyles();
  const datasource = useSelector(getDatasource);
  const dataflow = useSelector(getDataflow);
  const { isLoading: isLoadingStructure, isError, error } = useSdmxStructure();

  useSdmxACForFrequency();
  useSdmxACForTimePeriod();

  let errorMessage = null;
  if (isError) {
    const status = error?.response?.status;
    // the space or datasource can be invalid (missing or mismatch with config/settings)
    // the sdmx structure is in error in this case,
    // we just check before if it's related to this case before jumping to the next case
    if (R.isEmpty(datasource))
      errorMessage = (
        <FormattedMessage
          id="log.error.sdmx.invalid.space"
          values={{ space: dataflow.datasourceId }}
        />
      );
    else if (status === 404)
      errorMessage = <FormattedMessage id="log.error.sdmx.404" />;
    else if (R.includes(status, [401, 402, 403]))
      errorMessage = <FormattedMessage id="log.error.sdmx.40x" />;
    else errorMessage = <FormattedMessage id="log.error.sdmx.xxx" />;
  }

  const { hasFailed, credentials, isAnonymous } = useSelector(
    getExtAuthOptions(datasource.id),
  );
  const isExtAuthenticated = !!credentials || isAnonymous;
  const isExtAuthCandidate = datasource.hasExternalAuth && !isExtAuthenticated;

  if (isExtAuthCandidate) return <SpaceAuthDialog datasource={datasource} />;

  return (
    <>
      {hasFailed && (
        <SpaceAuthDialog datasource={datasource} hasFailed={hasFailed} />
      )}
      {isLoadingStructure && (
        <Typography tabIndex={0} aria-live="assertive" style={visuallyHidden}>
          <FormattedMessage id="de.visualisation.loading" />
        </Typography>
      )}
      <VisPage id={ID_VIS_PAGE}>
        {isError && (
          <div>
            <div className={classes.gutters}>
              <NoData message={errorMessage} />
            </div>
          </div>
        )}

        {isLoadingStructure && (
          <div>
            <div className={classes.gutters}>
              <Loading
                message={<FormattedMessage id="de.visualisation.loading" />}
              />
            </div>
          </div>
        )}

        {!isError && !isLoadingStructure && (
          <Grid container>
            <VisSurvey />
            {R.not(isFull) && R.not(isMicrodata) && (
              <div className={classes.gutters}>
                {!isNarrow && <FiltersHelp />}
                <div
                  className={classes.space}
                  style={{ maxWidth: visPageWidth * MARGE_RATIO }}
                ></div>
              </div>
            )}
            <div
              className={classes.gutters}
              wrap={isNarrow ? 'wrap' : 'nowrap'}
            >
              {R.not(isFull) && R.not(isMicrodata) && (
                <div className={classes.side}>
                  <NarrowFilters isNarrow={isNarrow}>
                    <Side classes={classes} />
                  </NarrowFilters>
                </div>
              )}
              <Grid>
                <VisUserFilters />
                <VisDataPoints />
                <Grid item xs={12} className={classes.visContainer}>
                  <VisData />
                </Grid>
              </Grid>
            </div>
            <ScrollToButtons />
          </Grid>
        )}
      </VisPage>
    </>
  );
};

export default Vis;
