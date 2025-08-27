import React from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import { useSelector } from 'react-redux';
import { getRefAreaDimension } from '@sis-cc/dotstatsuite-sdmxjs';
import DEToolBar from './visions/DeToolBar';
import {
  changeActionId,
  changeDisplay,
  changeFullscreen,
  changeViewer,
} from '../ducks/vis';
import {
  getViewer,
  getDisplay,
  getIsOverview,
  getIsTable,
} from '../selectors/router';
import { getIsPending } from '../selectors/app.js';
import { getDimensions } from '../selectors/sdmx';
import {
  getIsFull,
  getVisActionId,
  getIsOpeningFullscreen,
  getAvailableCharts,
} from '../selectors';
import {
  getIsMicrodata,
  getHasMicrodata,
  getHasMicrodataData,
} from '../selectors/microdata';
import { EXCEL, PNG } from '../utils/constants';

export const DOWNLOAD = 'download';

const ToolBar = ({ viewerProps }) => {
  const isDownloading = useSelector(getIsPending('requestingDataFile'));
  const isPendingExcel = useSelector(getIsPending(EXCEL));
  const isPendingPng = useSelector(getIsPending(PNG));
  const dimensions = useSelector(getDimensions);
  const viewerId = useSelector(getViewer);
  const availableCharts = useSelector(getAvailableCharts);
  const dimensionGetter = useSelector(getDisplay);
  const actionId = useSelector(getVisActionId());
  const isFull = useSelector(getIsFull());
  const isOpening = useSelector(getIsOpeningFullscreen);
  const hasMicrodata = useSelector(getHasMicrodata);
  const isMicrodata = useSelector(getIsMicrodata);
  const isOverview = useSelector(getIsOverview);
  const hasMicrodataData = useSelector(getHasMicrodataData);
  const isTable = useSelector(getIsTable);

  return (
    <DEToolBar
      availableCharts={availableCharts}
      changeActionId={changeActionId}
      viewerId={viewerId}
      actionId={actionId}
      changeViewer={changeViewer}
      changeDisplay={changeDisplay}
      changeFullscreen={changeFullscreen}
      dimensionGetter={dimensionGetter}
      isFull={isFull}
      isOpening={isOpening}
      isDownloading={R.any(R.identity)([
        isPendingExcel,
        isPendingPng,
        isDownloading,
      ])}
      hasRefAreaDimension={R.not(R.isNil(getRefAreaDimension({ dimensions })))}
      hasMicrodata={hasMicrodata}
      isMicrodata={isMicrodata}
      hasMicrodataData={hasMicrodataData}
      isOverview={isOverview}
      isTable={isTable}
      viewerProps={viewerProps}
    />
  );
};

ToolBar.propTypes = {
  viewerProps: PropTypes.object,
};

export default ToolBar;
