import * as R from 'ramda';
import facetParser from './facetParser';

export default (options) =>
  R.pipe(
    R.reject(R.pipe(R.prop('buckets'), R.isEmpty)),
    R.toPairs,
    R.map(facetParser(options)),
  );
