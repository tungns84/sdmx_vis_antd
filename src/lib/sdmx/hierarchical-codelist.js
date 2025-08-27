import * as R from 'ramda';
import { rules2 } from '@sis-cc/dotstatsuite-components';
import {
  getDataStructureAnnotations,
  getDataflowAnnotations,
} from './accessors/structure';
import { sortByProp } from '../../utils/sort';

export const getHierarchicalCodelistsReferences = (sdmxJson) => {
  const dsdReferences = rules2.getHCodelistsRefs(
    getDataStructureAnnotations(sdmxJson),
  );
  const dataflowReferences = rules2.getHCodelistsRefs(
    getDataflowAnnotations(sdmxJson),
  );

  return R.mergeRight(dsdReferences, dataflowReferences);
};

export const getMultiHierarchicalFilters = (filters, hierarchies) =>
  R.pipe(
    R.map((dimension) => {
      const indexedValues = R.indexBy(R.prop('id'), dimension.values || []);
      if (!R.has(dimension.id, hierarchies)) {
        return R.over(
          R.lensProp('values'),
          R.map(
            R.over(R.lensProp('parentId'), (id) =>
              R.has(id, indexedValues) ? id : undefined,
            ),
          ),
          dimension,
        );
      }
      const hierarchy = rules2.refinePartialHierarchy(
        R.prop(dimension.id, hierarchies),
        indexedValues,
      );

      let rest = indexedValues;
      const values = R.pipe(
        (hierarchy) =>
          R.reduce(
            (acc, parentKey) => {
              const ids = R.prop(parentKey, hierarchy);
              rest = R.omit(ids, rest);
              const parentId = parentKey === '#ROOT' ? undefined : parentKey;
              const values = R.pipe(
                R.props(ids),
                R.reject(R.isNil),
                R.map((val) => ({
                  ...val,
                  hierarchicalId: R.isNil(parentId)
                    ? val.id
                    : `${parentId}.${val.id}`,
                  parentId,
                })),
              )(indexedValues);

              return R.concat(acc, values);
            },
            [],
            R.keys(hierarchy),
          ),
        (values) => {
          if (R.isEmpty(rest)) {
            return values;
          }
          const evolved = R.pipe(
            R.values,
            R.map(R.assoc('parentId', undefined)),
            sortByProp('position'),
          )(rest);

          return R.concat(evolved, values);
        },
      )(hierarchy);
      return R.assoc('values', values, dimension);
    }),
  )(filters);
