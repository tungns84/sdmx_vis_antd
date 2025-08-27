import * as R from 'ramda';
import md5 from 'md5';
import C from './constants';

export const setFormat = (string = '') =>
  R.converge(
    (match, str) => R.replace(R.head(match), '', str),
    [R.match(C.VALUE_MASK), R.identity],
  )(`${string}`);

export const extractId = R.pipe(
  R.match(C.FACET_VALUE_MASK),
  R.last,
  R.ifElse(R.isNil, R.always(''), R.identity),
  R.tail,
  R.dropLast(1),
);

export default (options) =>
  ({ val, count, label, order }) => ({
    id: val,
    code: extractId(val),
    label: setFormat(label),
    order: R.defaultTo(0, order),
    count: count === 0 ? null : count,
    isDisabled: R.equals(count, 0), // should be at rendering level
    isSelected: R.has(
      md5(`${options.facetId}${val}`),
      R.defaultTo({}, options.constraints),
    ),
    // should be at rendering level
    svgPath: R.path(
      ['valueIcons', options.facetId, extractId(val)],
      options.config,
    ),
  });
