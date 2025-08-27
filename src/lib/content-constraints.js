import * as R from 'ramda';
import { compareAsc } from 'date-fns';

const parsePeriodRegion = ({ startPeriod = {}, endPeriod = {} }) => ({
  boundaries: R.pluck('period', [startPeriod, endPeriod]),
  includingBoundaries: R.pluck('isInclusive', [startPeriod, endPeriod]),
});

const getSet = R.reduce((acc, { id, values = [], timeRange = {} }) => {
  if (!R.isEmpty(timeRange)) {
    return R.assoc(id, parsePeriodRegion(timeRange), acc);
  }
  if (R.isEmpty(values)) return acc;
  return R.assoc(id, new Set(values), acc);
}, {});

const parseConstraint = cubeRegions =>
  R.reduce(
    (acc, { isIncluded, keyValues = [] }) => {
      if (!isIncluded) return acc;
      return R.mergeRight(getSet(keyValues), acc);
    },
    {},
    cubeRegions,
  );

export const parseContentConstraints = structure =>
  R.pipe(
    R.pathOr([], ['data', 'contentConstraints']),
    R.reduce((acc, constraint) => {
      if (!R.propEq('Actual', 'type', constraint)) {
        return acc;
      }
      let _constraint = {
        ...constraint,
        cubeRegions: parseConstraint(R.propOr([], 'cubeRegions', constraint)),
        code: constraint.id,
        id: `${constraint.agencyID}:${constraint.id}(${constraint.version})`,
      };
      const now = new Date();
      if (!R.isNil(constraint.validTo)) {
        if (compareAsc(now, new Date(constraint.validTo)) !== -1) {
          _constraint = R.assoc(
            'tag',
            `expired ${constraint.validTo}`,
            _constraint,
          );
          return { ...acc, expired: R.append(_constraint, acc.expired || []) };
        }
      }
      if (!R.isNil(constraint.validFrom)) {
        if (compareAsc(now, new Date(constraint.validFrom)) !== 1) {
          _constraint = R.assoc(
            'tag',
            `embargoed ${constraint.validFrom}`,
            _constraint,
          );
          return {
            ...acc,
            embargoed: R.append(_constraint, acc.embargoed || []),
          };
        }
      }
      _constraint = R.assoc('tag', 'live', _constraint);
      return R.assoc('live', _constraint, acc);
    }, {}),
    R.evolve({
      expired: R.sortBy(c => c.validTo.getTime()),
      embargoed: R.sortBy(c => c.validFrom.getTime()),
    }),
  )(structure);

export const constrainSelection = ({ contentConstraints, selection }) =>
  R.pipe(
    R.pick(R.keys(contentConstraints)),
    R.mapObjIndexed((val, id) => {
      const setIds = R.prop(id)(contentConstraints);
      return R.filter(vId => setIds.has(vId))(val);
    }),
  )(selection);
