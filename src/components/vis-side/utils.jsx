import * as R from 'ramda';

export const tagAccessor = (count) => (R.gt(count, 0) ? count : null);
