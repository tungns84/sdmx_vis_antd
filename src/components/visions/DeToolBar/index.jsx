import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import * as R from 'ramda';
import { useIntl } from 'react-intl';
import { Alert } from '@sis-cc/dotstatsuite-visions';
import makeStyles from '@mui/styles/makeStyles';
import GetAppIcon from '@mui/icons-material/GetApp';
import Toolbar from '@mui/material/Toolbar';
import TuneIcon from '@mui/icons-material/Tune';
import RepeatIcon from '@mui/icons-material/Repeat';
import ShareIcon from '@mui/icons-material/Share';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import DeveloperModeOutlinedIcon from '@mui/icons-material/DeveloperModeOutlined';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import SvgIcon from '@mui/material/SvgIcon';
import GridOnOutlinedIcon from '@mui/icons-material/GridOnOutlined';
import { Button } from './helpers';
import Labels from './Labels';
import Charts from './Charts';
import Downloads from './Downloads';
import { chartIsVisible } from '../../../lib/settings';
// avoid MICRODATA repetition but requires to pass as a prop to avoid import if pushed to visions
import { OVERVIEW, TABLE, MICRODATA } from '../../../utils/constants';
import { toolbarMessages } from '../../messages';
import { formatMessage, FormattedMessage } from '../../../i18n';
import { LOG_ERROR_VIS_CSV_DL, flushLog } from '../../../ducks/app';
import { csvDlStartTick } from '../../../ducks/vis';
import { getLog, getUser } from '../../../selectors/app.js';
import { getHasCsvDlStart } from '../../../selectors';
import { getIsDataUrlTooLong } from '../../../selectors/sdmx';

const FULLSCREEN = 'fullscreen';
const SHARE = 'share';
const CONFIG = 'config';
const API = 'api';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: '64px',
  },
  warning: {
    color: 'black',
  },
}));

const isLogWarning = (log) => R.path(['log', 'statusCode'], log) === 404;

const Component = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const intl = useIntl();
  const csvDlLog = useSelector(getLog(LOG_ERROR_VIS_CSV_DL));
  const hasCsvDlStart = useSelector(getHasCsvDlStart);
  const isDataUrlTooLong = useSelector(getIsDataUrlTooLong);
  const [showDataUrlTooLongMessage, setShowDataUrlTooLongMessage] =
    useState(true);
  const isAuthenticated = !!useSelector(getUser);
  // icon dry
  // usemenu dry
  // xs display
  useEffect(() => {
    if (R.and(R.isNil(props.isOpening), props.isFull)) {
      document.getElementById(FULLSCREEN).focus();
      props.changeFullscreen(true, true);
    }
  }, [props.isFull]);

  return (
    <React.Fragment>
      <Toolbar data-testid="detoolbar" className={classes.root} disableGutters>
        <div role="list" className={classes.root}>
          <div role="listitem">
            <Button
              startIcon={<ListAltIcon />}
              onClick={() => dispatch(props.changeViewer(OVERVIEW))}
              selected={R.equals(props.viewerId, OVERVIEW)}
              aria-pressed={R.equals(props.viewerId, OVERVIEW)}
              data-testid="overview-button"
              isToolTip
            >
              {formatMessage(intl)(toolbarMessages.overview)}
            </Button>
          </div>
          <div role="listitem">
            <Button
              startIcon={<TableChartOutlinedIcon />}
              onClick={() => dispatch(props.changeViewer(TABLE))}
              selected={R.equals(props.viewerId, TABLE)}
              aria-pressed={R.equals(props.viewerId, TABLE)}
              data-testid="table-button"
              isToolTip
            >
              {formatMessage(intl)(toolbarMessages.table)}
            </Button>
          </div>
          {props.hasMicrodata && (
            <div role="listitem">
              <Button
                id={MICRODATA}
                startIcon={<GridOnOutlinedIcon />}
                onClick={() => dispatch(props.changeViewer(MICRODATA))}
                selected={props.isMicrodata}
                aria-pressed={props.isMicrodata}
                disabled={R.not(props.hasMicrodataData)}
                isToolTip
              >
                {formatMessage(intl)(toolbarMessages.microdata)}
              </Button>
            </div>
          )}
          {chartIsVisible && (
            <div role="listitem">
              <Charts
                availableCharts={props.availableCharts}
                chart={props.viewerId}
                changeChart={(type, options) =>
                  dispatch(props.changeViewer(type, options))
                }
                selected={
                  !R.any(R.equals(props.viewerId), [TABLE, MICRODATA, OVERVIEW])
                }
                hasRefAreaDimension={props.hasRefAreaDimension}
              />
            </div>
          )}
        </div>
        <div role="list" className={classes.root}>
          <div role="listitem">
            <Labels
              label={props.dimensionGetter}
              changeLabel={(id) => dispatch(props.changeDisplay(id))}
            />
          </div>
          {!props.isMicrodata && !props.isOverview && (
            <div role="listitem">
              <Button
                data-testid="customize"
                startIcon={props.isTable ? <RepeatIcon /> : <TuneIcon />}
                onClick={() => dispatch(props.changeActionId(CONFIG))}
                aria-expanded={R.equals(props.actionId, CONFIG)}
                selected={R.equals(props.actionId, CONFIG)}
                isToolTip
              >
                {props.isTable
                  ? formatMessage(intl)(toolbarMessages.layout)
                  : formatMessage(intl)(toolbarMessages.customize)}
              </Button>
            </div>
          )}
          {((window.SETTINGS?.share?.endpoint &&
            !props.isMicrodata &&
            !props.isOverview) ||
            (isAuthenticated && props.isOverview)) && (
            <div role="listitem">
              <Button
                startIcon={<ShareIcon />}
                onClick={() => dispatch(props.changeActionId(SHARE))}
                selected={R.equals(props.actionId, SHARE)}
                aria-expanded={R.equals(props.actionId, SHARE)}
                isToolTip
              >
                {formatMessage(intl)(toolbarMessages.share)}
              </Button>
            </div>
          )}
          <div role="listitem">
            <Downloads
              loading={props.isDownloading}
              viewerProps={props.viewerProps}
            />
          </div>
          {!props.isMicrodata && (
            <div role="listitem">
              <Button
                id={API}
                startIcon={<DeveloperModeOutlinedIcon />}
                onClick={() => dispatch(props.changeActionId(API))}
                selected={R.equals(props.actionId, API)}
                aria-expanded={R.equals(props.actionId, API)}
                isToolTip
              >
                {formatMessage(intl)(toolbarMessages.apiqueries)}
              </Button>
            </div>
          )}
          <div role="listitem">
            <Button
              id={FULLSCREEN}
              startIcon={
                props.isFull ? (
                  <SvgIcon
                    focusable="false"
                    aria-hidden="true"
                    data-testid="ZoomInMapIcon"
                    tabindex="-1"
                    viewBox="0 0 24 24"
                    title="ZoomInMapIcon"
                  >
                    <path d="M9 9V3H7v2.59L3.91 2.5 2.5 3.91 5.59 7H3v2zm12 0V7h-2.59l3.09-3.09-1.41-1.41L17 5.59V3h-2v6zM3 15v2h2.59L2.5 20.09l1.41 1.41L7 18.41V21h2v-6zm12 0v6h2v-2.59l3.09 3.09 1.41-1.41L18.41 17H21v-2z"></path>
                  </SvgIcon>
                ) : (
                  <ZoomOutMapIcon />
                )
              }
              onClick={() =>
                dispatch(props.changeFullscreen(R.not(props.isFull)))
              }
              selected={props.isFull}
              aria-pressed={props.isFull}
              isToolTip
            >
              {formatMessage(intl)(toolbarMessages.fullscreen)}
            </Button>
          </div>
          {/*<More actionId={props.actionId} changeActionId={props.changeActionId} />*/}
        </div>
      </Toolbar>
      {csvDlLog && (
        <Alert
          className={isLogWarning(csvDlLog) ? classes.warning : null}
          data-testid="csv-dl-error"
          severity={isLogWarning(csvDlLog) ? 'warning' : 'error'}
          variant="filled"
          onClose={() => dispatch(flushLog(LOG_ERROR_VIS_CSV_DL))}
        >
          <strong>
            <FormattedMessage id="data.download.csv.error" />
          </strong>
          {isLogWarning(csvDlLog)
            ? ''
            : R.pathOr('', ['log', 'message'], csvDlLog)}
        </Alert>
      )}
      {hasCsvDlStart && (
        <Alert
          data-testid="csv-dl-start"
          icon={<GetAppIcon />}
          color="success"
          variant="filled"
          onClose={() => dispatch(csvDlStartTick())}
        >
          <strong>
            <FormattedMessage id="data.download.csv.launch" />
          </strong>
          <FormattedMessage id="data.download.csv.launch.detail" />
        </Alert>
      )}
      {isDataUrlTooLong && showDataUrlTooLongMessage && (
        <Alert
          className={classes.warning}
          severity="warning"
          variant="filled"
          onClose={() => setShowDataUrlTooLongMessage(false)}
        >
          <FormattedMessage id="data.warning.url.too.long" />
        </Alert>
      )}
    </React.Fragment>
  );
};

Component.propTypes = {
  availableCharts: PropTypes.object.isRequired,
  changeActionId: PropTypes.func.isRequired,
  viewerId: PropTypes.string,
  actionId: PropTypes.string,
  changeViewer: PropTypes.func.isRequired,
  changeDisplay: PropTypes.func.isRequired,
  changeFullscreen: PropTypes.func.isRequired,
  dimensionGetter: PropTypes.string,
  isFull: PropTypes.bool,
  isOpening: PropTypes.bool,
  isDownloading: PropTypes.bool,
  hasRefAreaDimension: PropTypes.bool,
  externalResources: PropTypes.array,
  hasMicrodata: PropTypes.bool,
  isMicrodata: PropTypes.bool,
  hasMicrodataData: PropTypes.bool,
  isOverview: PropTypes.bool,
  isTable: PropTypes.bool,
  viewerProps: PropTypes.object,
};

export default Component;
