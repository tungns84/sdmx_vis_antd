import * as R from 'ramda';
import valueTreeParser from './valueTreeParser';
import { sortByOrderAndLabel } from '../../utils/sort';

const fillTree = (valueParser) => (values) => {
  const missingKeys = R.converge(R.pipe(R.difference, R.reject(R.isNil)), [
    R.pluck('parentId'),
    R.pluck('id'),
  ])(values);
  if (R.isEmpty(missingKeys)) return values;
  const missingValues = R.map((val) => valueParser({ val }), missingKeys);
  return fillTree(valueParser)(R.concat(values, missingValues));
};

export default (options) =>
  ([id, { buckets = [] }]) => {
    const valueParser = valueTreeParser({ facetId: id, ...options });
    const values = fillTree(valueParser)(R.map(valueParser, buckets));

    return {
      id,
      label: id,
      values: sortByOrderAndLabel(options?.config?.localeId)(values),
      count: R.pipe(R.filter(R.propEq(true, 'isSelected')), R.length)(values),
      hasPath: true, // if values are hierarchical and values path are computed by the parser
    };
  };
