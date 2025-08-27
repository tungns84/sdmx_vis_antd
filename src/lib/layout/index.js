import * as R from 'ramda';
import { isTimePeriodDimension } from '@sis-cc/dotstatsuite-sdmxjs';

export const getValuesFlat = R.pipe(R.values, R.flatten);

export const compactLayout =
  ({ many = {} } = {}, combinations = []) =>
  (layout) => {
    if (R.isNil(layout)) return layout;
    const combinationsIds = R.pluck('id', combinations);
    const idsNotInMany = R.difference(
      getValuesFlat(layout),
      R.isEmpty(many)
        ? []
        : [...R.keys(many), 'OBS_ATTRIBUTES', ...combinationsIds],
    );
    const res = R.map(R.flip(R.difference)(idsNotInMany))(layout);
    return res;
  };

export const getLayoutCombinations = R.filter(
  (comb) => !R.isEmpty(R.propOr([], 'relationship', comb)),
);

export const getTableConfigLayout = (layout) => {
  const parseDimension = (dimension) => {
    return {
      ...dimension,
      count: R.length(dimension.values),
      isTimePeriod: isTimePeriodDimension(dimension),
    };
  };

  const parseCombination = (combination) => {
    const count = R.pipe(
      R.propOr([], 'dimensions'),
      R.pluck('values'),
      R.unnest,
      R.length,
    )(combination);

    return {
      ...combination,
      count,
    };
  };
  let items = [];
  const layoutIds = R.mapObjIndexed(
    R.reduce((acc, entry) => {
      if (R.has('dimensions', entry)) {
        if (R.isEmpty(entry.dimensions)) {
          return acc;
        }
        items = R.append(parseCombination(entry), items);
        return R.append(entry.id, acc);
      }
      if (R.length(entry.values || []) < 2) {
        return acc;
      } else if (entry.id !== 'OBS_ATTRIBUTES') {
        items = R.append(parseDimension(entry), items);
      }
      return R.append(entry.id, acc);
    }, []),
    layout,
  );
  return { layout: layoutIds, items };
};

export const cleanLayoutIds = (combinations, layoutIds) => {
  const indexedConcepts = R.reduce(
    (acc, comb) => R.assoc(comb.id, comb.concepts, acc),
    {},
    combinations,
  );
  return R.map((ids) => {
    const dimsInCombs = R.pipe(
      R.map((id) => R.propOr({ concepts: [] }, id, indexedConcepts)),
      R.unnest,
    )(ids);
    return R.isEmpty(dimsInCombs) ? ids : R.difference(ids, dimsInCombs);
  }, layoutIds);
};

/*
  when submitting new layout changes to url, some dimensions may have been lost in case
  of change in data selection between layout customizations. Reinjecting them callow to keep in memory
  previous customization of this dimension and reapply it if new data selection reintroduce the dimensions.
  Excluding dimensions part of a combination, relationship to others will be applied if reintroduced.
*/
export const refineWithCurrent = (currentRouterIds, nextIds, combinations) => {
  const idsKept = new Set(
    R.flatten(R.values(nextIds), R.pluck('concepts', combinations)),
  );
  const lostIds = R.map(
    R.reject((id) => idsKept.has(id) || id === 'OBS_ATTRIBUTES'),
    currentRouterIds,
  );

  return R.mergeWith(
    (next, lost) => {
      if (R.last(next) === 'OBS_ATTRIBUTES') {
        return R.unnest([R.dropLast(1, next), lost, ['OBS_ATTRIBUTES']]);
      }
      return R.concat(next, lost);
    },
    nextIds,
    lostIds,
  );
};
