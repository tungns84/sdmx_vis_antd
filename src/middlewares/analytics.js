import * as R from 'ramda';
import { crypto } from 'jsrsasign';
import {
  DOWNLOAD_FILE_SUCCESS,
  SHARE_SUCCESS,
  CHANGE_LAYOUT,
  CHANGE_VIEWER,
} from '../ducks/vis';
import { HANDLE_STRUCTURE, REQUEST_CSV_DATAFILE } from '../ducks/sdmx';
import { CHANGE_CONSTRAINTS, CHANGE_TERM } from '../ducks/search';
import { getVisDataflow } from '../selectors';
import { sendEvent } from '../utils/analytics';
import { CHANGE_LOCALE, USER_SIGNED_IN, USER_SIGNED_OUT } from '../ducks/app';

const isDev = process.env.NODE_ENV === 'development';

export const UPDATE_CHART_CONFIG = '@@analytics/UPDATE_CHART_CONFIG';
const analyticsActions = new Set([
  REQUEST_CSV_DATAFILE,
  DOWNLOAD_FILE_SUCCESS,
  SHARE_SUCCESS,
  HANDLE_STRUCTURE,
  CHANGE_LOCALE,
  CHANGE_TERM,
  CHANGE_LAYOUT,
  CHANGE_VIEWER,
  CHANGE_CONSTRAINTS,
  USER_SIGNED_IN,
  USER_SIGNED_OUT,
  UPDATE_CHART_CONFIG,
]);

export const formatConstraints = (pushHistory) => {
  //function for browse_by event
  const constraints = R.pipe(
    R.path(['payload', 'constraints']),
    R.defaultTo({}),
  )(pushHistory);
  const formattedConstraints = R.map((constraint) => {
    //get object without knowing the key after "constraint"
    const { facetId, constraintId } = constraint;
    return facetId + '=' + constraintId;
  }, constraints);
  const concatConstraints = R.join(' > ', R.values(formattedConstraints)); //get values then join them
  return concatConstraints;
};

export const getUserId = (action) => {
  const user = R.prop('user', action);
  return R.isNil(user) || R.isNil(user.email)
    ? undefined
    : crypto.Util.hashString(user.email, 'SHA256');
};

export const analyticsMiddleware =
  ({ getState }) =>
  (next) =>
  (action) => {
    if (!analyticsActions.has(action.type)) return next(action);
    const future = next(action); // need to be after for HANDLE_STRUCTURE

    // eslint-disable-next-line no-console
    if (isDev) console.info(`[MDL] analytics ${action.type}`);

    const { pushHistory = {} } = action;

    let dataLayer;
    const dataflow = getVisDataflow(getState());

    switch (action.type) {
      case REQUEST_CSV_DATAFILE:
        dataLayer = {
          event: 'file_download',
          file_extension: 'csv',
          file_name: action.payload.filename,
        };
        break;
      case DOWNLOAD_FILE_SUCCESS: //download Table (excel) or Chart (PNG)
        dataLayer = {
          event: 'file_download',
          file_extension: action.payload.id,
          file_name: action.payload.fileName,
        };
        break;
      case SHARE_SUCCESS:
        dataLayer = {
          event: 'share',
          social_network: null,
        };
        break;
      case HANDLE_STRUCTURE:
        dataLayer = {
          event: 'load_dataflow',
          dataset_code: R.prop('id', dataflow),
          dataset_name: R.prop('name', dataflow),
        };
        break;
      case USER_SIGNED_IN:
        dataLayer = {
          isGTMEvent: true,
          event: 'login',
          is_logged: true,
          user_id: getUserId(action),
        };
        break;
      case USER_SIGNED_OUT:
        dataLayer = {
          isGTMEvent: true,
          event: 'login',
          is_logged: false,
          user_id: undefined,
        };
        break;
      case CHANGE_CONSTRAINTS:
        dataLayer = {
          isGTMEvent: true,
          event: 'browse_by',
          browse_by_value: formatConstraints(pushHistory),
        };
        break;
      case CHANGE_TERM:
        dataLayer = {
          isGTMEvent: true,
          event: 'view_search_results',
          search_term: pushHistory.payload.term,
        };
        break;
      case CHANGE_LOCALE:
        dataLayer = {
          isGTMEvent: true,
          event: 'select_language',
          language_method: 'dropdown',
          language_selected: pushHistory.payload.locale,
        };
        break;
      case CHANGE_LAYOUT:
      case UPDATE_CHART_CONFIG:
        dataLayer = {
          isGTMEvent: true,
          event: 'change_layout',
          dataset_code: R.prop('id', dataflow),
          dataset_name: R.prop('name', dataflow),
        };
        break;
      case CHANGE_VIEWER:
        dataLayer = {
          isGTMEvent: true,
          event: 'change_viewer',
          chart_type: pushHistory.payload.viewer,
          dataset_code: R.prop('id', dataflow),
          dataset_name: R.prop('name', dataflow),
        };
        break;
      default:
        // eslint-disable-next-line no-console
        if (isDev) console.log(`[MDL] analytics unknown type ${action.type}`);
        return future;
    }
    sendEvent({ dataLayer });
    return future;
  };
