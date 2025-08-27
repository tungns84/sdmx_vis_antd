import * as R from 'ramda';
import { sortByOrderAndLabel } from '../../utils/sort';

export { default as searchParser } from './searchParser';
export { default as configParser } from './configParser';
export { default as searchConstants } from './constants';

/*
 * a facet is irrelevant if:
 * - results count is equal to ALL values count if it doesn't have values with count less than the ALL values count
 */

export const rejectIrrelevantFacets = ({ count, locale }) => {
  return R.reduce((acc, el) => {
    const valuesWithCountLessNbs = R.filter((value) => {
      return value.count && value.count !== count;
    })(R.prop('values')(el));
    if (!R.isEmpty(valuesWithCountLessNbs))
      acc.push({
        ...el,
        values: sortByOrderAndLabel(locale)(el.values),
      });
    return acc;
  }, []);
};
