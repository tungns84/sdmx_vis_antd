import * as R from 'ramda';
import C from './constants';

export default (hl) => {
  if (R.isEmpty(R.match(/<(\/)?mark>/))) {
    return null;
  }
  const split = R.split(C.FACET_LEVEL_SEPARATOR, hl);
  const id = R.pipe(R.last, R.match(C.VALUE_MASK), R.nth(1))(split);

  return {
    valueId: id,
    label: R.pipe(
      R.when(R.pipe(R.length, R.lt(1)), R.tail),
      R.join(C.FACET_HIGHLIGHT_SEPARATOR),
      R.replace(C.FACET_VALUE_MASK, ''),
    )(split),
  };
};
