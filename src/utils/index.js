import * as R from 'ramda';
export * from './analytics';

export const renameKeys = R.curry((keysMap, obj) =>
  R.reduce(
    (acc, key) => R.assoc(keysMap[key] || key, obj[key], acc),
    {},
    R.keys(obj),
  ),
);

export const isValidNumber = R.both(R.is(Number), R.complement(R.equals(NaN)));
export const withIndex = R.addIndex(R.map)((value, index) =>
  R.assoc('index', index)(value),
);
export const countNumberOf = (items) =>
  R.pipe(
    R.map(({ values = [] }) => R.length(values)),
    R.sum,
  )(items);

export const getFilterLabel = (labelAccessor) => (item) =>
  labelAccessor({
    id: R.prop('id')(item),
    name: R.prop('label')(item),
  });

export const makeTree = (items) => {
  const hierarchy = R.reduce(
    (index, item) =>
      item.parent in index
        ? R.assoc(
            item.id,
            [],
            R.assoc(item.parent, R.append(item.id, index[item.parent]), index),
          )
        : R.assoc(item.id, [], index),
    {},
    items,
  ); //=> E.g. {"1":[2],"2":[3],"3":[],"4":[]}
  const index = R.map(R.head, R.groupBy(R.prop('id'), items)); //=> E.g. {"!": <item1>, "2": <item2>, ...}
  let makeNode;
  const assoc = (id) => {
    const childNodes = (id) => R.map(makeNode, hierarchy[id]);
    return R.isEmpty(childNodes(id))
      ? index[id]
      : R.assoc('childNodes', childNodes(id), index[id]);
  };
  makeNode = (id) => R.dissoc('parent', assoc(id));
  return R.map(
    makeNode,
    R.pluck(
      'id',
      R.filter((item) => R.isNil(item.parent), items),
    ),
  );
};

export const computeHasSpotlight = (values) => {
  const LIMIT = 8;
  if (R.gt(R.length(values), LIMIT)) return true;

  const computeflatArray = (acc, item) => {
    if (item.childNodes)
      return R.reduce(computeflatArray, acc, item.childNodes);
    return [...acc, item.id];
  };

  return R.gt(R.length(R.reduce(computeflatArray, [], values)), LIMIT);
};

export const getEndPointId = (uri) =>
  R.pipe(
    R.values,
    R.find(R.pipe(R.prop('endpoint'), R.flip(R.includes)(uri))),
    R.prop('id'),
  );

export const isPerfectMatch = R.pipe(
  R.replace(/<mark>(.*?)<\/mark>/g, ''),
  R.replace(/[ ~!@#$%^&*(){}[\]`/=?+|\-_;:'",<.>]/gm, ''),
  R.isEmpty,
);

export const cleanifyLayoutIds = (layoutIds = {}) =>
  R.mergeRight({ header: [], sections: [], rows: [] }, layoutIds);
