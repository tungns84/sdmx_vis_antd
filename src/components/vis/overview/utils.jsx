import * as R from 'ramda';

// https://gitlab.com/sis-cc/.stat-suite/dotstatsuite-data-explorer/-/issues/760
const HIDDEN_IDS = new Set(['_Z', '_T']);

export const isLast = (index, list) => index + 1 === R.length(list);

export const groupDimensions = (dimensions, actualConstraints) => {
  return R.reduce(
    (acc, dimension) => {
      if (R.prop(dimension.id, actualConstraints)?.size === 1) {
        const id = R.head([...R.prop(dimension.id, actualConstraints)]);
        if (HIDDEN_IDS.has(id)) return acc;
        return R.over(
          R.lensProp('oneDimensions'),
          R.append(
            R.over(
              R.lensProp('values'),
              R.pipe(R.find(R.propEq(id, 'id')), R.of(Array)),
              dimension,
            ),
          ),
        )(acc);
      }
      return R.over(R.lensProp('manyDimensions'), R.append(dimension))(acc);
    },
    { oneDimensions: [], manyDimensions: [] },
    dimensions,
  );
};

export const groupAttributes = (
  attributes,
  actualConstraints,
  oneDimensions,
) => {
  const indexedOneDimensions = R.indexBy(R.prop('id'), oneDimensions);
  const getIsDataflowLevel = (relationship) => {
    if (R.has('none', relationship)) return true;
    if (R.has('dataflow', relationship)) return true;
    if (R.has('dimensions', relationship)) {
      const isAllUniqueValueDimension = R.allPass(
        R.map((id) => R.has(id), relationship.dimensions),
      );
      return isAllUniqueValueDimension(indexedOneDimensions);
    }
    return false;
  };

  return R.reduce(
    (acc, attribute) => {
      const enhancedAttribute = R.assoc('name', attribute.label, attribute);
      if (
        R.pathOr(1, [attribute.id, 'size'], actualConstraints) === 1 &&
        getIsDataflowLevel(enhancedAttribute?.relationship)
      ) {
        return R.over(
          R.lensProp('oneAttributes'),
          R.append(enhancedAttribute),
        )(acc);
      }
      return acc;
    },
    { oneAttributes: [] },
    attributes,
  );
};
