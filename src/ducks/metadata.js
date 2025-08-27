import { CHANGE_DATAFLOW, RESET_DATAFLOW, FLUSH_DATA } from './sdmx';

const model = () => ({
  cellAttributes: undefined,
  coordinates: undefined,
  error: undefined,
  isOpen: false,
});

const TOGGLE_METADATA = '@@metadata/toggle';
const CLOSE_METADATA = '@@metadata/close';

export const toggleMetadata = (payload) => ({
  type: TOGGLE_METADATA,
  payload,
});

export const closeMetadata = () => ({
  type: CLOSE_METADATA,
});

export default (state = model(), action = {}) => {
  switch (action.type) {
    case TOGGLE_METADATA:
      return {
        ...state,
        isOpen: true,
        coordinates: action.payload.coordinates,
        cellAttributes: action.payload.advancedAttributes,
      };
    case CLOSE_METADATA:
    case RESET_DATAFLOW:
    case CHANGE_DATAFLOW:
    case FLUSH_DATA:
      return model();
    default:
      return state;
  }
};
