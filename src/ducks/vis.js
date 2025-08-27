import FileSaver from 'file-saver';
import * as R from 'ramda';
import { getFilter } from '../selectors';
import { getData, getRawDataRequestArgs } from '../selectors/sdmx';
import { HANDLE_STRUCTURE, CHANGE_DATAFLOW, RESET_DATAFLOW } from './sdmx';
import { SET_PENDING } from './app';
import { createExcelWorkbook } from '../xlsx';
import { getFilename } from '../lib/sdmx';
import { PANEL_USED_FILTERS, CHART_IDS } from '../utils/constants';
import { getIsMicrodata } from '../selectors/microdata';
import { RESET_SEARCH } from './search';

//---------------------------------------------------------------------------------------------model
export const model = () => ({
  actionId: undefined,
  isFull: false,
  title: undefined,
  filter: PANEL_USED_FILTERS,
  excel: { error: undefined, id: undefined },
  png: { error: undefined, id: undefined },
  hasCsvDlStart: false, // to be used for browser dl launch message
  shared: false,
});

//-------------------------------------------------------------------------------------------actions
export const CHANGE_ACTION_ID = '@@vis/CHANGE_ACTION_ID';
export const CHANGE_FULLSCREEN = '@@vis/CHANGE_FULLSCREEN';
export const SHARE_CHART = '@@vis/SHARE_CHART';
export const CHANGE_LAYOUT = '@@vis/CHANGE_LAYOUT';
export const CHANGE_DISPLAY = '@@vis/CHANGE_DISPLAY';
export const CHANGE_TIME_DIMENSION_ORDERS =
  '@@vis/CHANGE_TIME_DIMENSION_ORDERS';
export const SHARE_SUCCESS = '@@vis/SHARE_SUCCESS';
export const DOWNLOAD_FILE = '@@vis/DOWNLOAD_FILE ';
export const DOWNLOAD_FILE_SUCCESS = '@@vis/DOWNLOAD_FILE_SUCCESS ';
export const DOWNLOAD_FILE_ERROR = '@@vis/DOWNLOAD_FILE_ERROR ';
export const CLOSE_SHARE_POPUP = '@@vis/CLOSE_SHARE_POPUP';
export const CHANGE_VIEWER = '@@vis/CHANGE_VIEWER';
export const CHANGE_FILTER = '@@vis/CHANGE_FILTER';
export const CSV_DL_START = '@@vis/CSV_DL_START';

//------------------------------------------------------------------------------------------creators
export const changeFilter = (filterId) => (dispatch, getState) => {
  const prevFilterId = getFilter(getState());
  const filter = R.ifElse(
    R.equals(prevFilterId),
    R.always(null),
    R.identity,
  )(filterId);
  dispatch({ type: CHANGE_FILTER, payload: { filter } });
};
export const changeFullscreen = (isFull, isOpening) => ({
  type: CHANGE_FULLSCREEN,
  payload: { isFull, isOpening },
});
export const changeActionId = (actionId) => ({
  type: CHANGE_ACTION_ID,
  payload: { actionId },
});
export const shareChart = ({ media, sharedData, shareResponse }) => ({
  type: SHARE_CHART,
  payload: { label: media, sharedData, shareResponse },
});
export const changeLayout = (layout) => ({
  type: CHANGE_LAYOUT,
  pushHistory: {
    pathname: '/vis',
    payload: { layout },
  },
});
export const changeDisplay = (display) => ({
  type: CHANGE_DISPLAY,
  pushHistory: { pathname: '/vis', payload: { display } },
});
export const changeTimeDimensionOrders = (id, order) => ({
  type: CHANGE_TIME_DIMENSION_ORDERS,
  pushHistory: { pathname: '/vis', payload: { time: { [id]: order } } },
});
export const shareSuccess = () => ({
  type: SHARE_SUCCESS,
  payload: {},
});
export const csvDlStartTick = () => ({ type: CSV_DL_START });
export const closeSharePopup = () => ({ type: CLOSE_SHARE_POPUP });
export const changeViewer =
  (id, option = {}) =>
  (dispatch, getState) => {
    const action = {
      type: CHANGE_VIEWER,
      pushHistory: {
        pathname: '/vis',
        payload: {
          viewer: R.has('map', option) ? CHART_IDS.CHOROPLETHCHART : id,
          map: R.prop('map', option),
        },
      },
    };
    const noData = R.isNil(getData(getState()));
    if (getIsMicrodata(getState()) && noData)
      return dispatch(R.assoc('request', 'getData', action));
    dispatch(action);
  };

//--------------------------------------------------------------------------------------thunks (api)
const downloadFile =
  ({ blob, ext, id }) =>
  (dispatch, getState) => {
    // for a better accuracy
    // pending has to be set true at the begining of your parsing
    const args = getRawDataRequestArgs(getState());
    const fileName = getFilename(args);
    try {
      FileSaver.saveAs(blob, `${fileName}${ext}`);
      dispatch({ type: SET_PENDING, payload: { id, is: false } });
      dispatch({ type: DOWNLOAD_FILE_SUCCESS, payload: { id, fileName } });
    } catch (error) {
      dispatch({ type: DOWNLOAD_FILE_ERROR, payload: { error, id } });
    }
  };

export const downloadExcel = (props) => (dispatch) => {
  dispatch({ type: SET_PENDING, payload: { id: props.id, is: true } });
  return createExcelWorkbook(props)
    .then((workbook) => workbook.outputAsync(workbook))
    .then((blob) => {
      dispatch(downloadFile({ id: props.id, blob, ext: '.xlsx' }));
    });
};

export const downloadPng = (uiHandler, id) => (dispatch) => {
  dispatch({ type: SET_PENDING, payload: { id, is: true } });
  return uiHandler().then(function (canvas) {
    canvas.toBlob(function (blob) {
      dispatch(downloadFile({ id, blob, ext: '.png' }));
    });
  });
};

//-------------------------------------------------------------------------------------------reducer
export default (state = model(), action = {}) => {
  switch (action.type) {
    case HANDLE_STRUCTURE:
      return R.pipe(
        // TO CHECK with the team: layout is not stored in vis state
        // but in router state
        //R.set(R.lensProp('layout'), R.path(['structure', 'layout'], action)),
        R.set(R.lensProp('title'), R.path(['structure', 'name'], action)),
      )(state);
    case CHANGE_FULLSCREEN:
      return R.pipe(
        R.set(R.lensProp('isFull'), R.path(['payload', 'isFull'], action)),
        R.set(
          R.lensProp('isOpeningFullscreen'),
          R.path(['payload', 'isOpening'], action),
        ),
      )(state);
    case CHANGE_ACTION_ID:
      return R.evolve({
        actionId: R.cond([
          [R.equals(action.payload.actionId), R.always(undefined)],
          [R.T, R.always(action.payload.actionId)],
        ]),
      })(state);
    case CHANGE_VIEWER:
      return R.set(R.lensProp('actionId'), undefined, state);
    case CHANGE_LAYOUT:
      return { ...state, actionId: undefined };
    case CHANGE_FILTER:
      return { ...state, filter: action.payload.filter };
    case DOWNLOAD_FILE_ERROR:
      return {
        ...state,
        [action.payload.id]: {
          error: action.payload.error,
          id: action.payload.id,
        },
      };
    case DOWNLOAD_FILE_SUCCESS:
      return {
        ...state,
        [action.payload.id]: { error: undefined, id: action.payload.id },
      };
    case CSV_DL_START:
      return R.over(R.lensProp('hasCsvDlStart'), R.not, state);
    case SHARE_SUCCESS:
      return R.over(R.lensProp('shared'), R.not, state);
    case RESET_SEARCH:
    case RESET_DATAFLOW:
    case CHANGE_DATAFLOW:
      return model();
    default:
      return state;
  }
};
