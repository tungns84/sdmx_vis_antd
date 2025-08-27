/*
 *
 * sort helper:
 * ------------
 * gather when possible all sort in the codebase
 * to scope ramda sort function to the helper
 * to ease maintainance and natural sort
 *
 */

import * as R from 'ramda';

export const ASC = 'asc';
export const DESC = 'desc';

const isAsc = R.equals(ASC);
const comparator = (d = ASC) => (isAsc(d) ? R.ascend : R.descend);
const naturalComparator = (d = ASC) =>
  isAsc(d) ? R.ascendNatural : R.descendNatural;

const transducer = (p, t = []) => R.pipe(R.prop(p), ...t);
const byNaturalProp = (p, l = 'en', d, t) =>
  naturalComparator(d)(l, transducer(p, t));
const byProp = (p, d, t) => comparator(d)(transducer(p, t));

const sortByNatural = (p, l, d, t) => R.sort(byNaturalProp(p, l, d, t));
const sortBy = (p, d, t) => R.sort(byProp(p, d, t));

export const sortByProp = (p) => R.sortBy(R.prop(p));
export const sortByIndex = sortByProp('index');
export const sortByLabel = (l, d, t) => sortByNatural('label', l, d, t);

export const sortByNumberId = (d) => sortBy('id', d, [Number]);

export const sortByOrderAndLabel = (l) =>
  R.sortWith([byProp('order'), byNaturalProp('label', l)]);
