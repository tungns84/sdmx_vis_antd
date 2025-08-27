import * as R from 'ramda';
import { useQuery } from 'react-query';
import mapApi from '../../api/map';
import { getMap } from '../../lib/settings/index';
import { queryKeyFactory } from './utils.js';
import { useSelector } from 'react-redux';
import { getMap as getRouterMap, getViewer } from '../../selectors/router';
import { CHART_IDS } from '../../utils/constants';

const IN_CACHE_PROPS = ['map'];

const mapMaker = ({ routerMap }) => {
  if (R.anyPass([R.isNil, R.isEmpty])(routerMap)) return {};

  const { mapId, levelId } = R.pick(['levelId', 'mapId'], routerMap);
  if (R.isNil(mapId) || R.isNil(levelId)) {
    return { preparationError: 'missing map entries in router' };
  }

  const map = getMap(mapId);
  if (R.isNil(map))
    return { preparationError: 'inexistant map entry in settings' };

  return { map, levelId };
};

export default () => {
  const routerMap = useSelector(getRouterMap);
  const viewer = useSelector(getViewer);

  const { map, levelId, preparationError } = mapMaker({ routerMap });

  const ctx = {
    method: 'getMap',
    requestArgs: { mapPath: map?.path },
  };

  const isChoroplethMap = viewer === CHART_IDS.CHOROPLETHCHART;
  const isEnabled =
    isChoroplethMap && R.isNil(preparationError) && !R.isNil(map);

  const transformerHook =
    ({ map, levelId }) =>
    (data) => {
      const extendedMap = R.pipe(
        R.assoc('topology', data),
        R.assoc('areaSelection', levelId),
      )(map);

      return { map: extendedMap };
    };

  const queryKey = queryKeyFactory(ctx);
  const query = useQuery(
    queryKey,
    () => mapApi(ctx).then(transformerHook({ map, levelId })),
    { enabled: isEnabled },
  );

  return {
    // it's more user-friendly to expose direct RQ props (isLoading, isError, etc...)
    // without internals
    ...R.omit(['queryKey', 'isEnabled', 'data'], query),
    // only expose in cache props to avoid breaking single source of thruth principle
    // other props are stored in redux store for good or bad (refactoring needed) reasons
    ...R.pick(IN_CACHE_PROPS, R.propOr({}, 'data', query)),
    preparationError, // not used but could be useful if too many support about bad settings around map
  };
};
