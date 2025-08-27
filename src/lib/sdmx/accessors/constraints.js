import * as R from 'ramda';

/*
 * constraints accessors should always and only take a valid SDMX constraints as param
 * basic format of an accesor is: constraints => {}
 * if a context is needed, use a fof: ctx => constraints => {}
 */

export const getTimePeriodBoundaries = R.pathOr(
  [],
  ['TIME_PERIOD', 'boundaries'],
);
