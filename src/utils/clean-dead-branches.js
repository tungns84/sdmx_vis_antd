import * as R from 'ramda';

// This function is to delete children without parent.
// If there is no value that have data, then there is no list to display
// ("hasData" contentConstraints from structure request).

export const cleanDeadBranches = (flatlist, accessor = R.prop('hasData')) => {
  const getHId = (v) => R.prop('hierarchicalId', v) || R.prop('id', v);
  if (R.find(R.pipe(accessor, R.equals(true)))(flatlist)) {
    const grouped = R.groupBy(R.propOr('#ROOT', 'parentId'), flatlist);

    const filterEnabled = R.filter((v) => {
      if (accessor(v)) {
        return true;
      }
      const id = getHId(v);
      const children = R.propOr([], id, grouped);
      const enabledChildren = filterEnabled(children);
      return !R.isEmpty(enabledChildren);
    });

    return filterEnabled(flatlist);
  }
  if (R.find(R.pipe(accessor, R.equals(false)))(flatlist)) return [];
  return flatlist;
};
