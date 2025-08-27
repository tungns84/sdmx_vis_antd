import * as R from 'ramda';
// import { setPending, LOG_ERROR, LOG_SUCCESS, flushLog, pushLog } from './app';
import shareApi from '../api/share';

const isDev = process.env.NODE_ENV === 'development';

//--------------------------------------------------------------------------------------------model
export const model = () => ({
  list: [],
  confirmUrl: null,
  chartStatus: null,
  logs: [],
  pending: {},
});

export const LOG_SUCCESS = 'LOG_SUCCESS';
export const LOG_ERROR = 'LOG_ERROR';

//------------------------------------------------------------------------------------------actions
export const PUSH_LOG = '@@share/PUSH_LOG';
export const FLUSH_LOG = '@@share/FLUSH_LOG';
export const SET_PENDING = '@@share/SET_PENDING';
export const HANDLE_NEW_CHART = '@@share/HANDLE_NEW_CHART';
export const HANDLE_LIST = '@@share/HANDLE_LIST';
export const HANDLE_CONFIRMED = '@@share/HANDLE_CONFIRMED';
export const HANDLE_DELETE = '@@share/HANDLE_DELETE';
export const HANDLE_DELETE_ALL = '@@share/HANDLE_DELETE_ALL';
export const SEND_EMAIL_LIST = '@@share/SEND_EMAIL_LIST';
export const OPEN_LINK = '@@share/OPEN_LINK';

const pushLog = (log) => ({ type: PUSH_LOG, payload: { log } });
const flushLog = (type) => ({ type: FLUSH_LOG, payload: { type } });
export const setPending = (id, is) => ({
  type: SET_PENDING,
  payload: { id, is },
});

const request = (dispatch, ctx) => {
  const { method } = ctx;
  const pendingId = ctx.pendingId || method;

  // eslint-disable-next-line no-console
  if (isDev) console.info(`share request: ${pendingId}`);

  dispatch(setPending(pendingId, true));
  dispatch(flushLog(method));
  return shareApi(ctx)
    .then((data) => {
      dispatch(setPending(pendingId));
      const log = { statusCode: data.status };
      dispatch(pushLog({ type: LOG_SUCCESS, log, method }));
      return data;
    })
    .catch((error) => {
      const log = error.response
        ? {
            errorCode: error.response.data.errorCode,
            statusCode: error.response.status,
          }
        : { error };

      dispatch(setPending(pendingId));
      dispatch(pushLog({ type: LOG_ERROR, log, method }));
      return {};
    });
};

export const requestChart = (id) => (dispatch) => {
  return request(dispatch, { method: 'get', id }).then(({ data }) => {
    dispatch({ type: HANDLE_NEW_CHART, payload: { chart: data } });
  });
};

export const requestList = (token) => (dispatch) => {
  return request(dispatch, { method: 'list', token }).then(({ data = [] }) => {
    dispatch({ type: HANDLE_LIST, payload: { list: data } });
  });
};

export const requestConfirm = (token) => (dispatch) => {
  return request(dispatch, { method: 'confirm', token }).then(({ data }) => {
    dispatch(requestList(token)(dispatch));
    dispatch({
      type: HANDLE_CONFIRMED,
      payload: { url: data?.url, status: 'CONFIRMED' },
    });
  });
};

export const requestDelete =
  ({ id, token }) =>
  (dispatch) => {
    return request(dispatch, { method: 'delete', id, token }).then(() => {
      dispatch(requestList(token)(dispatch));
      dispatch({ type: HANDLE_DELETE });
    });
  };

export const requestDeleteAll =
  ({ token }) =>
  (dispatch) => {
    return request(dispatch, { method: 'delete', token }).then(() => {
      dispatch(requestList(token)(dispatch));
      dispatch({ type: HANDLE_DELETE_ALL });
    });
  };

export const requestToken = (body) => (dispatch) => {
  return request(dispatch, { method: 'getEmail', body }).then(() => {
    dispatch({ type: SEND_EMAIL_LIST });
  });
};

export const openLink = () => ({ type: OPEN_LINK });

//--------------------------------------------------------------------------------reducer

export default (state = model(), action = {}) => {
  let nextState;
  switch (action.type) {
    case PUSH_LOG:
      nextState = R.over(
        R.lensProp('logs'),
        R.prepend(action.payload.log),
        state,
      );
      break;
    case FLUSH_LOG:
      nextState = R.pipe(
        R.over(
          R.lensProp('logs'),
          R.reject(R.propEq(action.payload.type, 'type')),
        ),
        R.over(
          R.lensProp('logs'),
          R.reject(R.propEq(action.payload.type, 'method')),
        ),
      )(state);
      break;
    case SET_PENDING:
      nextState = R.set(
        R.lensPath(['pending', action.payload.id]),
        action.payload.is,
        state,
      );
      break;
    case HANDLE_NEW_CHART:
      nextState = R.set(
        R.lensProp('chartStatus'),
        R.prop('status', action.payload.chart),
      )(state);
      break;
    case HANDLE_LIST:
      nextState = R.set(R.lensProp('list'), action.payload.list)(state);
      break;
    case HANDLE_CONFIRMED:
      nextState = R.pipe(
        R.set(R.lensProp('confirmUrl'), action.payload.url),
        R.set(R.lensProp('chartStatus'), action.payload.status),
      )(state);
      break;
    case OPEN_LINK:
      nextState = R.set(R.lensProp('confirmUrl'), null, state);
      break;
    default:
      return state;
  }
  return nextState;
};
