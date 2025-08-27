import * as R from 'ramda';
import valueParser from './valueParser';

export default (options) => (value) =>
  R.pipe(
    R.split('|'),
    R.converge(
      (label, path, level) => ({
        ...valueParser(options)({
          val: value.val,
          label,
          count: R.defaultTo(0, value.count),
          order: R.defaultTo(0, value.order),
        }),
        parentId: R.ifElse(
          R.isNil,
          R.identity,
          // add an accessor to scopelist to remove the following code
          // adjust the current level to build a valid parentId
          R.pipe(R.prepend(R.dec(level)), R.join('|')),
        )(path),
        level,
        path,
      }),
      [
        R.last,
        R.pipe(R.init, R.tail, R.ifElse(R.isEmpty, R.always(null), R.identity)),
        R.pipe(R.head, Number),
      ],
    ),
  )(value.val);
