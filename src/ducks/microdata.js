import * as R from 'ramda';
import { getVisDataDimensions } from '../selectors';
import { CHANGE_DATAQUERY, HANDLE_STRUCTURE, RESET_DATAFLOW } from './sdmx';
import { MICRODATA } from '../utils/constants';

//---------------------------------------------------------------------------------------------model
const model = () => ({
  data: undefined,
  range: undefined,
  dimensionId: undefined,
});

//-------------------------------------------------------------------------------------------actions
export const FLUSH_MICRODATA = '@@microdata/flush';
export const HANDLE_MICRODATA = '@@microdata/handle';
export const UPDATE_MICRODATA_CONSTRAINTS = '@@microdata/updateConstraints';

//------------------------------------------------------------------------------------------creators
export const updateMicrodataConstraints =
  (constraints = {}, selection) =>
  (dispatch, getState) => {
    const { many } = getVisDataDimensions()(getState());
    const selectedKeys = R.map(R.propOr('', 'id'))(selection);
    const microdataConstraints = R.pick(
      [...R.keys(many), ...selectedKeys],
      constraints,
    );
    dispatch({
      type: UPDATE_MICRODATA_CONSTRAINTS,
      pushHistory: {
        pathname: '/vis',
        payload: { microdataConstraints, viewer: MICRODATA },
      },
    });
  };

//-------------------------------------------------------------------------------------------reducer
export default (state = model(), action = {}) => {
  switch (action.type) {
    case HANDLE_STRUCTURE:
      return R.set(
        R.lensProp('dimensionId'),
        action.structure.microdataDimensionId,
        state,
      );
    case FLUSH_MICRODATA:
    case RESET_DATAFLOW:
    case CHANGE_DATAQUERY:
      return { ...state, data: null, range: null };
    case HANDLE_MICRODATA:
      return { ...state, ...R.pick(['data', 'range'], action) };
    default:
      return state;
  }
};
