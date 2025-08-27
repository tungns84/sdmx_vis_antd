import * as R from 'ramda';

const getHierarchicalId = (v) => v.hierarchicalId || v.id;

const getSelectedValuesGroupedByParentId = (indexed) =>
  R.pipe(
    R.groupBy((val) => {
      const parentHierarchicalId = val.parentId || '#ROOT';
      return R.has(parentHierarchicalId, indexed)
        ? R.path([parentHierarchicalId, 'id'], indexed)
        : parentHierarchicalId;
    }),
    (grouped) => {
      const filterChildren = R.filter((child) => {
        if (child.isSelected) {
          return true;
        }
        return !R.isEmpty(filterChildren(R.propOr([], child.id, grouped)));
      });
      return R.map(filterChildren, grouped);
    },
  );

const getReccursiveAncestors = (indexedValues, parentId) => {
  if (!R.has(parentId, indexedValues)) {
    return [];
  }
  const parent = R.prop(parentId, indexedValues);
  const ancestors = R.isNil(parent.parentId)
    ? []
    : getReccursiveAncestors(indexedValues, parent.parentId);
  return R.append(parent, ancestors);
};

export const getUsedFilters = (filters) =>
  R.reduce(
    (res, dim) => {
      const indexed = R.indexBy(getHierarchicalId, dim.values || []);
      const groupedSelectedValuesByParent = getSelectedValuesGroupedByParentId(
        indexed,
      )(dim.values || []);

      const getNumberOfSelectedChildren = R.pipe(
        getHierarchicalId,
        R.flip(R.propOr([]))(groupedSelectedValuesByParent),
        R.length,
      );

      const { values } = R.reduce(
        (acc, val) => {
          if (!val.isSelected) {
            return acc;
          }
          const _parents = getReccursiveAncestors(indexed, val.parentId);
          const parents = R.append(val, _parents);
          const deprecated = R.pipe(
            R.takeLastWhile(
              (par) => getNumberOfSelectedChildren(par) < 2 && !par.hasData,
            ),
            R.filter(R.prop('isSelected')),
            R.pluck('id'),
          )(_parents);
          if (R.has(val.id, acc.indexes)) {
            const index = R.prop(val.id, acc.indexes);
            return R.pipe(
              R.over(R.lensPath(['values', index, 0, 'parents']), (p) =>
                R.isNil(p) ? [parents] : R.append(parents, p),
              ),
              R.over(R.lensPath(['values', index, 0, 'deprecated']), (p) =>
                R.isNil(p) ? [deprecated] : R.concat(deprecated, p),
              ),
            )(acc);
          }
          const index = R.length(acc.values);
          return {
            values: R.append(
              [
                {
                  ...val,
                  parents: R.length(parents) > 1 ? [parents] : null,
                  deprecated,
                  isNotRemovable:
                    Boolean(val.isForced) &&
                    getNumberOfSelectedChildren(val) >= 1,
                },
              ],
              acc.values,
            ),
            indexes: R.assoc(val.id, index, acc.indexes),
          };
        },
        { values: [], indexes: {} },
        dim.values || [],
      );
      if (R.length(values) > 0) {
        return R.append(R.assoc('values', values, dim), res);
      }
      return res;
    },
    [],
    filters,
  );
