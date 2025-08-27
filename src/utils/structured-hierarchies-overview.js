import * as R from 'ramda';
export const makeSelectedHierarchySchemesList = (list) =>
  R.pipe(
    R.groupBy(R.prop('id')),
    R.map((group) =>
      R.reduce(
        (acc, { values = [] }) => {
          if (R.isEmpty(values)) return acc;
          return R.assoc(
            'values',
            acc.values ? R.append(values, acc.values) : [values],
            acc,
          );
        },
        { ...R.head(group), values: [] },
      )(group),
    ),
    R.values,
  )(list);
