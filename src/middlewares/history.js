import * as R from 'ramda';
import {
  ROUTER_ON_LOCATION_CHANGED,
  push,
  replace,
  replaceStraight,
} from '@lagunovsky/redux-react-router';
import { fromSearchToState, fromStateToSearch } from '../utils/router';
import { getLocationState, getPathname } from '../selectors/router';
import { getVisDataDimensions } from '../selectors';
import { getSeriesCombinations } from '../selectors/data';
import { compactLayout } from '../lib/layout';

const isDev = process.env.NODE_ENV === 'development';

// you can push and replace in the history
// but "pushHistory" will be taken first compared to "replaceHistory"
const historyActions = [
  ['pushHistory', push],
  ['replaceHistory', replace],
  ['replaceStraigthHistory', replaceStraight],
];

export const historyMiddleware = (store) => (next) => (action) => {
  //const prevState = getLocationState(store.getState());

  // POP action reset state to null
  if (
    action.type === ROUTER_ON_LOCATION_CHANGED &&
    action.payload.action === 'POP'
  ) {
    return next(
      R.set(
        R.lensPath(['payload', 'location', 'state']),
        fromSearchToState(action.payload.location.search),
        action,
      ),
    );
  }

  const historyAction = R.find(
    R.pipe(R.head, R.flip(R.prop)(action), R.isNil, R.not),
    historyActions,
  );

  if (R.isNil(historyAction)) return next(action);

  const [key, method] = historyAction;
  const actionHistory = R.propOr({}, key, action);
  const pathname = R.defaultTo(
    getPathname(store.getState()),
    actionHistory.pathname,
  );

  const result = next(action);
  const nextState = getLocationState(store.getState());

  const state = R.ifElse(
    R.isNil,
    // reset if no payload with invariant id present (see app duck)
    R.always(R.pick(['locale', 'hasAccessibility', 'tenant'], nextState)),
    R.mergeRight(nextState),
  )(actionHistory.payload);

  const nextSearch = R.pipe(
    // fromStateToSearch is an evolution centered on url
    // the following evolution relies on selectors (more generally on things in state)
    R.evolve({
      layout: compactLayout(
        getVisDataDimensions()(store.getState()),
        getSeriesCombinations(store.getState()),
      ),
    }),
    fromStateToSearch,
  )(state);

  store.dispatch(method({ pathname, search: nextSearch }, state));

  // eslint-disable-next-line no-console
  if (isDev) console.info(`[MDL] history ${action.type} -> ${pathname}`);

  return result;
};
