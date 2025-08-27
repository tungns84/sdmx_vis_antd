import * as R from 'ramda';
import {
  getDataStructureAnnotations,
  getDataflowAnnotations,
} from './accessors/structure';

export const parseAutomatedSelections = (annotations) =>
  R.pipe(
    R.filter(R.propEq('ALWAYS_DISPLAY_PARENTS', 'type')),
    R.pluck('title'),
    R.join(','),
    R.split(','),
    R.reduce((acc, entry) => {
      if (R.isEmpty(entry)) {
        return acc;
      }
      const [dimension, _levels] = R.split('=', entry);
      if (R.isNil(_levels)) {
        return R.assoc(dimension, [], acc);
      }
      const levels = R.pipe(
        R.split('+'),
        R.reduce((_acc, str) => {
          const match = R.match(/LEVEL([\d]+)/, str);
          if (R.isEmpty(match)) {
            return _acc;
          }
          const index = Number(match[1]) - 1;
          if (isNaN(index)) {
            return _acc;
          }
          return R.append(index, _acc);
        }, []),
      )(_levels);
      if (R.has(dimension, acc)) {
        if (R.isEmpty(acc[dimension])) {
          return acc;
        }
        return R.over(
          R.lensProp(dimension),
          R.pipe(R.concat(levels), R.uniq),
        )(acc);
      }
      return R.assoc(dimension, levels, acc);
    }, {}),
  )(annotations);

export const getAutomatedSelections = (structure) => {
  return parseAutomatedSelections(
    R.concat(
      getDataStructureAnnotations(structure),
      getDataflowAnnotations(structure),
    ),
  );
};

export const applyAutomatedSelection = (values, levels) => {
  const grouped = R.groupBy(R.propOr('#ROOT', 'parentId'), values);

  const getValues = (parentsIds) => {
    const level = R.length(parentsIds);
    const parentId = level === 0 ? '#ROOT' : R.last(parentsIds);
    return R.pipe(
      R.map((val) => {
        const id = val.hierarchicalId || val.id;
        const isParent = R.has(id, grouped);
        return R.prepend(
          {
            ...val,
            isForced:
              (R.isEmpty(levels) || R.includes(level, levels)) && isParent,
            imposedIds: R.isEmpty(levels)
              ? parentsIds
              : R.pipe(R.props(levels), R.filter(R.identity))(parentsIds),
          },
          isParent ? getValues(R.append(id, parentsIds)) : [],
        );
      }),
      R.unnest,
    )(R.propOr([], parentId, grouped));
  };

  return getValues([]);
};

export const getAdvancedValuesPathes = (hierarchy) => {
  const paired = R.toPairs(hierarchy);

  return R.reduce(
    (acc, [parentsKey, values]) => {
      const path = parentsKey === '#ROOT' ? [] : R.split('.', parentsKey);
      let res = acc;
      R.forEach((value) => {
        if (R.has(value, res)) {
          res = R.over(R.lensProp(value), R.append(path), res);
        } else {
          res = R.set(R.lensProp(value), [path], res);
        }
      }, values);
      return res;
    },
    {},
    paired,
  );
};

export const getSimpleValuesPathes = (values) => {
  const indexedValues = R.indexBy(R.prop('id'), values);

  const getParents = (value) => {
    if (R.isNil(value.parentId)) {
      return [];
    }
    if (R.isNil(R.prop(value.parentId, indexedValues))) {
      return [];
    }
    const parent = R.prop(value.parentId, indexedValues);
    return R.append(value.parentId, getParents(parent));
  };

  return R.reduce(
    (acc, value) => {
      return R.assoc(value.id, [getParents(value)], acc);
    },
    {},
    values,
  );
};

export const computeLevelSelections = (selection, dimension, hierarchy) => {
  const indexedPaths = R.isNil(hierarchy)
    ? getSimpleValuesPathes(dimension.values)
    : getAdvancedValuesPathes(hierarchy);

  const leveledValues = R.reduce(
    (acc, [id, paths]) =>
      R.reduce(
        (_acc, path) => {
          const level = `LEVEL${R.length(path) + 1}`;
          return R.over(
            R.lensProp(level),
            (ids) => R.append(id, ids || []),
            _acc,
          );
        },
        acc,
        paths,
      ),
    {},
    R.toPairs(indexedPaths),
  );

  return R.pipe(
    R.map((id) => R.propOr(id, id, leveledValues)),
    R.unnest,
    R.uniq,
  )(selection);
};

export const parseDataquery = (dataquery, dimensions) => {
  const split = R.split('.', dataquery);

  return R.addIndex(R.reduce)(
    (acc, dim, index) => {
      const selection = R.nth(index, split);
      if (R.isNil(selection) || R.isEmpty(selection)) {
        return acc;
      }
      return R.assoc(dim.id, R.split('+', selection), acc);
    },
    {},
    dimensions,
  );
};

export const selectAutomatedSelections = (
  selection,
  dimensions,
  automatedSelections,
  hierarchies,
) =>
  R.reduce(
    (acc, dim) => {
      if (
        !R.has(dim.id, automatedSelections) ||
        R.isEmpty(R.propOr([], dim.id, acc))
      ) {
        return acc;
      }
      const levels = R.prop(dim.id, automatedSelections);
      const pathes = R.has(dim.id, hierarchies)
        ? getAdvancedValuesPathes(R.prop(dim.id, hierarchies))
        : getSimpleValuesPathes(R.propOr([], 'values', dim));

      return R.over(
        R.lensProp(dim.id),
        R.pipe(
          R.map((value) => {
            const valuePathes = R.propOr([], value, pathes);

            const refinedPathes = R.isEmpty(levels)
              ? valuePathes
              : R.map(
                  (path) => R.pipe(R.props(levels), R.filter(R.identity))(path),
                  valuePathes,
                );

            return R.append(value, refinedPathes);
          }),
          R.flatten,
          R.uniq,
        ),
        acc,
      );
    },
    selection,
    dimensions,
  );
