import * as R from 'ramda';
import { updateDataquery, getDataquery } from '@sis-cc/dotstatsuite-sdmxjs';
import {
  getDataquery as getRouterDataquery,
  getPeriod,
  getLastNMode,
} from '../selectors/router';
import {
  getDimensions,
  getFrequency,
  getFrequencyArtefact,
} from '../selectors/sdmx';
import {
  getSelectedIdsIndexed,
  setSelectedDimensionsValues,
  getOnlyHasDataDimensions,
} from '../lib/sdmx';
import {
  getSdmxPeriod,
  changeFrequency,
  getFrequencies,
} from '../lib/sdmx/frequency';
import {
  START_PERIOD,
  END_PERIOD,
  LASTNOBSERVATIONS,
  LASTNPERIODS,
} from '../utils/used-filter';
import { RESET_SEARCH } from './search';

//---------------------------------------------------------------------------------------------model
export const model = () => ({
  queryKey: [],
  dataRequestRange: 0,
  datasetAttributes: null,
  attributes: [],
  constraints: {},
  constraintId: undefined,
  dimensions: [],
  data: undefined,
  hiddenValuesAnnotation: {},
  timePeriod: undefined,
  range: {},
  externalReference: undefined,
  name: undefined,
  hierarchies: {},
  isDataUrlTooLong: false,
  isApiQueryCopied: false,
  isAvailabilityDisabled: false,
  parsedAttributes: undefined,
  microdataDimensionId: undefined,
  combinationsDefinition: undefined,
  defaultLayoutIds: null,
  actualContentConstraints: [],
});

//-----------------------------------------------------------------------------------------constants
export const HANDLE_STRUCTURE = '@@sdmx/HANDLE_STRUCTURE';
export const REQUEST_STRUCTURE = '@@sdmx/REQUEST_STRUCTURE';
export const PARSE_STRUCTURE = '@@sdmx/PARSE_STRUCTURE';
export const HANDLE_DATA = '@@sdmx/HANDLE_DATA';
export const REQUEST_DATA = '@@sdmx/REQUEST_DATA';
export const FLUSH_DATA = '@@sdmx/FLUSH_DATA';
export const FLUSH_STRUCTURE = '@@sdmx/FLUSH_STRUCTURE';
export const REQUEST_CSV_DATAFILE = '@@sdmx/REQUEST_CSV_DATAFILE';
export const CHANGE_DATAFLOW = '@@sdmx/CHANGE_DATAFLOW';
export const RESET_DATAFLOW = '@@sdmx/RESET_DATAFLOW';
export const CHANGE_DATAQUERY = '@@sdmx/CHANGE_DATAQUERY';
export const APPLY_DATA_AVAILABILITY = '@@sdmx/APPLY_DATA_AVAILABILITY';
export const CHANGE_FREQUENCY_PERIOD = '@@sdmx/CHANGE_FREQUENCY_PERIOD';
export const CHANGE_LAST_N_OBS = '@@sdmx/CHANGE_LAST_N_OBS';
export const CHANGE_LAST_N_OBS_DQ = '@@sdmx/CHANGE_LAST_N_OBS_DQ';
export const RESET_SPECIAL_FILTERS = '@@sdmx/RESET_SPECIAL_FILTERS';
export const HANDLE_EXTERNAL_REFERENCE = '@@sdmx/HANDLE_EXTERNAL_REFERENCE';
export const HANDLE_AVAILABLE_TIME_PERIOD =
  '@@sdmx/HANDLE_AVAILABLE_TIME_PERIOD';
export const HANDLE_AVAILABLE_FREQUENCY = '@@sdmx/HANDLE_AVAILABLE_FREQUENCY';
export const IS_DATA_URL_TOO_LONG = `@@sdmx/IS_DATA_URL_TOO_LONG`;
export const COPY_API_QUERY = `@@sdmx/COPY_API_QUERY`;
export const CHANGE_FREQUENCY_PERIOD_DATAQUERY =
  '@@sdmx/CHANGE_FREQUENCY_PERIOD_DATAQUERY';
export const CHANGE_CONSTRAINT_ID = '@@sdmx/CHANGE_CONSTRAINT_ID';
export const REQUEST_DATA_PROPS = ['dataquery', 'lastNObservations', 'period'];

//------------------------------------------------------------------------------------------creators
export const requestData = ({ shouldRequestStructure } = {}) => ({
  type: REQUEST_DATA,
  shouldRequestStructure,
});

export const requestCsvDataFile = ({ filename }) => ({
  type: REQUEST_CSV_DATAFILE,
  payload: { filename },
});

export const dataUrlIsTooLong = () => ({ type: IS_DATA_URL_TOO_LONG });
export const copyApiQuery = () => ({ type: COPY_API_QUERY });
export const changeConstraintId = constraintId => ({
  type: CHANGE_CONSTRAINT_ID,
  payload: { constraintId },
});

// actionHistory could be replaceHistory, pushHistory.
export const changeDataflow =
  (dataflow, actionHistory = 'pushHistory', viewer) =>
  (dispatch) => {
    if (R.isNil(dataflow)) return;
    dispatch({
      type: CHANGE_DATAFLOW,
      [actionHistory]: {
        pathname: '/vis',
        payload: {
          viewer,
          dataflow,
        },
      },
    });
  };

export const resetDataflow = () => (dispatch) => {
  dispatch({
    type: RESET_DATAFLOW,
    pushHistory: {
      pathname: '/',
      payload: {
        dataflow: null,
        filter: null,
        dataquery: null,
        hasDataAvailability: null,
        viewer: null,
        externalReference: null,
        isAvailabilityDisabled: false,
        // period: [undefined, undefined] is used to force no period, null means that default can be used
        period: null,
        lastNObservations: null,
        lastNMode: null,
        time: null,
        microdataConstraints: null,
        display: null,
        hierarchies: {},
        hCodes: {},
        defaultLayoutIds: null,
        constraintId: undefined,
        timePeriod: null,
        actualContentConstraints: [],
      },
    },
  });
};

export const changeLastNObservationsDataquery =
  (lastNObservations, lastNMode, selection = {}) =>
  (dispatch, getState) => {
    let payload = { lastNMode, lastNObservations };
    if (R.equals(lastNMode, LASTNPERIODS)) {
      payload.period = null;
    }
    if (R.isNil(lastNObservations) || R.isEmpty(lastNObservations)) {
      payload.lastNMode = undefined;
      payload.period = [undefined, undefined];
    }
    if (
      !R.isNil(lastNObservations) &&
      !R.isEmpty(lastNObservations) &&
      R.isNil(lastNMode)
    ) {
      payload.lastNMode = LASTNPERIODS;
      payload.period = null;
    }
    const currentLastNMode = getLastNMode(getState());
    if (lastNMode !== currentLastNMode && lastNMode === LASTNOBSERVATIONS) {
      payload.period = [undefined, undefined];
    }
    const dataquery = updateDataquery(
      getDimensions(getState()),
      getRouterDataquery(getState()),
      {
        ...selection,
      },
    );
    payload.dataquery = dataquery;

    dispatch({
      type: CHANGE_LAST_N_OBS_DQ,
      pushHistory: { pathname: '/vis', payload },
    });
  };

export const changeLastNObservations =
  (lastNObservations, lastNMode) => (dispatch, getState) => {
    let payload = { lastNMode, lastNObservations };
    if (R.equals(lastNMode, LASTNPERIODS)) {
      payload.period = null;
    }
    if (R.isNil(lastNObservations) || R.isEmpty(lastNObservations)) {
      payload.lastNMode = undefined;
      payload.period = [undefined, undefined];
    }
    if (
      !R.isNil(lastNObservations) &&
      !R.isEmpty(lastNObservations) &&
      R.isNil(lastNMode)
    ) {
      payload.lastNMode = LASTNPERIODS;
      payload.period = null;
    }
    const currentLastNMode = getLastNMode(getState());
    if (lastNMode !== currentLastNMode && lastNMode === LASTNOBSERVATIONS) {
      payload.period = [undefined, undefined];
    }
    dispatch({
      type: CHANGE_LAST_N_OBS,
      pushHistory: { pathname: '/vis', payload },
    });
  };

export const resetFilters = (selection) => (dispatch, getState) => {
  const selectedConstraints = R.reduce(
    (acc, dim) => R.assoc(dim.id, R.map(R.path([0, 'id']), dim.values), acc),
    {},
    selection,
  );
  const updatedQuery = updateDataquery(
    getDimensions(getState()),
    getRouterDataquery(getState()),
    selectedConstraints,
  );
  dispatch({
    type: CHANGE_DATAQUERY,
    pushHistory: {
      pathname: '/vis',
      payload: {
        dataquery: updatedQuery,
        period: [undefined, undefined],
        lastNObservations: null,
        lastNMode: null,
      },
    },
  });
};

export const resetSpecialFilters = (_, ids) => (dispatch, getState) => {
  const id = R.is(Array)(ids) ? R.head(ids) : ids;
  if (R.equals(LASTNOBSERVATIONS, id))
    return dispatch(changeLastNObservations());

  // special is start OR end (period)
  if (R.either(R.equals(START_PERIOD), R.equals(END_PERIOD))(id)) {
    const payloadPeriod = (period) => {
      if (R.equals(START_PERIOD, id)) return [undefined, R.last(period)];
      if (R.equals(END_PERIOD, id)) return [R.head(period), undefined];
    };
    return dispatch({
      type: CHANGE_FREQUENCY_PERIOD,
      pushHistory: {
        pathname: '/vis',
        payload: { period: payloadPeriod(getPeriod(getState())) },
      },
    });
  }

  // reset all special filters (period, lastNObservations)
  dispatch({
    type: RESET_SPECIAL_FILTERS,
    pushHistory: {
      pathname: '/vis',
      payload: {
        period: [undefined, undefined],
        lastNObservations: null,
        lastNMode: null,
      },
    },
  });
};

export const changeDataquery = (selection) => (dispatch, getState) => {
  const dataquery = updateDataquery(
    getDimensions(getState()),
    getRouterDataquery(getState()),
    {
      ...selection,
    },
  );
  dispatch({
    type: CHANGE_DATAQUERY,
    pushHistory: { pathname: '/vis', payload: { dataquery } },
  });
};

export const applyDataAvailability =
  (hasDataAvailability) => (dispatch, getState) => {
    dispatch({
      type: APPLY_DATA_AVAILABILITY,
      pushHistory: { pathname: '/vis', payload: { hasDataAvailability } },
    });

    if (R.not(hasDataAvailability)) return;

    const currentDataquery = getRouterDataquery(getState());
    const dimensions = getDimensions(getState());
    const dimensionsWithSelectedValues = setSelectedDimensionsValues(
      currentDataquery,
      dimensions,
    );
    const frequencyArtefact = getFrequencyArtefact(getState());
    const frequencyId = R.prop('id')(frequencyArtefact);
    const availableFrequencies = R.pipe(
      getOnlyHasDataDimensions,
      R.head,
      getFrequencies,
    )([frequencyArtefact]);
    const frequency = changeFrequency(getFrequency(getState()))(
      availableFrequencies,
    );
    const selection = R.assoc(
      frequencyId,
      frequency,
      getSelectedIdsIndexed(dimensionsWithSelectedValues),
    );
    const dataquery = getDataquery(dimensions, selection);

    if (R.equals(currentDataquery, dataquery)) return;

    dispatch({ type: CHANGE_FREQUENCY_PERIOD, payload: { frequency } });
    dispatch({
      type: CHANGE_DATAQUERY,
      pushHistory: { pathname: '/vis', payload: { dataquery } },
    });
  };

export const changeFrequencyPeriodDataquery =
  ({ valueId, period, dataquery } = {}) =>
  (dispatch, getState) => {
    const filterId = R.prop('id')(getFrequencyArtefact(getState()));
    const frequency = getFrequency(getState());
    const lastNMode = getLastNMode(getState());
    let payload = {
      period: R.ifElse(
        R.either(R.isNil, R.isEmpty),
        R.always([undefined, undefined]),
        R.identity,
      )(R.map(getSdmxPeriod(valueId))(period)),
    };
    if (R.equals(lastNMode, LASTNPERIODS) && frequency === valueId) {
      payload.lastNMode = undefined;
      payload.lastNObservations = undefined;
    }
    const newDataquery = updateDataquery(
      getDimensions(getState()),
      getRouterDataquery(getState()),
      {
        ...dataquery,

        [filterId]: [valueId],
      },
    );
    dispatch({
      type: CHANGE_FREQUENCY_PERIOD_DATAQUERY,
      pushHistory: {
        pathname: '/vis',
        payload: {
          ...payload,
          dataquery: newDataquery,
          period: R.equals(lastNMode, LASTNPERIODS) ? null : payload.period,
        },
      },
    });
  };

export const changeFrequencyPeriod =
  ({ valueId, period } = {}) =>
  (dispatch, getState) => {
    const filterId = R.prop('id')(getFrequencyArtefact(getState()));
    const frequency = getFrequency(getState());
    const lastNMode = getLastNMode(getState());
    let payload = {
      period: R.ifElse(
        R.either(R.isNil, R.isEmpty),
        R.always([undefined, undefined]),
        R.identity,
      )(R.map(getSdmxPeriod(valueId))(period)),
    };
    if (R.equals(lastNMode, LASTNPERIODS) && frequency === valueId) {
      payload.lastNMode = undefined;
      payload.lastNObservations = undefined;
    }
    const action = {
      type: CHANGE_FREQUENCY_PERIOD,
      pushHistory: {
        pathname: '/vis',
        payload,
      },
    };

    if (R.not(R.isNil(filterId)) && frequency !== valueId) {
      const dataquery = updateDataquery(
        getDimensions(getState()),
        getRouterDataquery(getState()),
        {
          [filterId]: [valueId],
        },
      );
      dispatch({
        type: CHANGE_FREQUENCY_PERIOD_DATAQUERY,
        pushHistory: {
          pathname: '/vis',
          payload: {
            ...payload,
            dataquery,
            period: R.equals(lastNMode, LASTNPERIODS) ? null : payload.period,
          },
        },
      });
      return;
    }

    dispatch(R.assoc('request', 'getData', action));
  };

//-------------------------------------------------------------------------------------------reducer
export default (state = model(), action = {}) => {
  switch (action.type) {
    case CHANGE_CONSTRAINT_ID:
      return R.set(
        R.lensProp('constraintId'),
        action.payload.constraintId,
        state,
      );
    case IS_DATA_URL_TOO_LONG:
      return R.set(R.lensProp('isDataUrlTooLong'), true, state);
    case FLUSH_DATA:
      return R.pipe(
        R.set(R.lensProp('data'), undefined),
        R.set(R.lensProp('range'), undefined),
        R.set(R.lensProp('parsedAttributes'), undefined),
      )(state);
    case HANDLE_EXTERNAL_REFERENCE:
      return R.set(
        R.lensProp('externalReference'),
        R.prop('externalReference', action),
      )(state);
    case HANDLE_STRUCTURE:
      return { ...state, ...action.structure };
    case HANDLE_AVAILABLE_TIME_PERIOD:
      return {
        ...state,
        constraints: { ...state.constraints, ...action.constraints },
      };
    case HANDLE_DATA:
      return { ...state, ...action.data };
    case COPY_API_QUERY:
      return R.set(R.lensProp('isApiQueryCopied'), true, state);
    case RESET_SEARCH:
    case RESET_DATAFLOW:
    case FLUSH_STRUCTURE:
    case CHANGE_DATAFLOW:
      return { ...state, ...model() };
    case CHANGE_DATAQUERY:
      return R.set(
        R.lensPath(['constraints', 'availableTimePeriod']),
        null,
      )(state);
    default:
      return state;
  }
};
