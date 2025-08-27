import React from 'react';
import { useSelector } from 'react-redux';
import * as R from 'ramda';
import ToolBar from './ToolBar';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import makeStyles from '@mui/styles/makeStyles';
import { getVisActionId } from '../selectors';
import { getViewer, getIsOverview } from '../selectors/router';
import APIQueries from './vis/api-queries';
import ShareView from './vis/share';
import { getUser } from '../selectors/app.js';
import { TABLE, MARGE_RATIO } from '../utils/constants';
import { getIsMicrodata } from '../selectors/microdata';
import Panel from './vis/Panel';
import Config from './vis-tools/config';
import Table from './vis-tools/table';
import { ShortUrls } from '@sis-cc/dotstatsuite-visions';
import useShortenUrl from '../hooks/useShortenUrl';
import useMaxWidth from '../hooks/useMaxWidth';

const useStyles = makeStyles((theme) => ({
  toolbar: {
    position: 'sticky',
    borderTop: `solid 2px ${theme.palette.grey[700]}`,
  },
  divider: {
    backgroundColor: theme.palette.grey[300],
  },
}));

const API = 'api';
const CONFIG = 'config';
const SHARE = 'share';

const Tools = ({ maxWidth, isFull, viewerProps, properties = {} }) => {
  const isMicrodata = useSelector(getIsMicrodata);
  const actionId = useSelector(getVisActionId());
  const viewerId = useSelector(getViewer);
  const isAuthenticated = !!useSelector(getUser);

  const classes = useStyles();
  const maxWidthStyles = useMaxWidth({
    visWidth: maxWidth - maxWidth * (1 - MARGE_RATIO),
    isFull: R.or(isFull, isMicrodata),
  });

  const isApi = R.equals(API)(actionId);
  const isTableConfig = R.equals(CONFIG)(actionId) && R.equals(TABLE)(viewerId);
  const isChartConfig =
    R.equals(CONFIG)(actionId) && !R.equals(TABLE)(viewerId);
  const isShare = R.equals(SHARE)(actionId);
  const isOverview = useSelector(getIsOverview);
  const { props, shortenUrl } = useShortenUrl();

  return (
    <div className={classes.toolbar} style={maxWidthStyles}>
      <ToolBar viewerProps={viewerProps} />
      <Collapse in={isApi}>
        <Panel actionId={API}>
          <APIQueries />
        </Panel>
      </Collapse>
      <Collapse in={isTableConfig}>
        <Panel actionId={CONFIG}>
          <Table />
        </Panel>
      </Collapse>
      <Collapse in={isChartConfig}>
        <Panel actionId={CONFIG}>
          <Config isAuthenticated={isAuthenticated} properties={properties} />
        </Panel>
      </Collapse>
      <Collapse in={isShare}>
        {isShare && (
          <Panel actionId={SHARE}>
            {isAuthenticated && (
              <div>
                <ShortUrls {...props} onClick={shortenUrl} />
                <Divider className={classes.divider} />
              </div>
            )}
            {!isOverview && <ShareView viewerProps={viewerProps} />}
          </Panel>
        )}
      </Collapse>
    </div>
  );
};

export default Tools;
