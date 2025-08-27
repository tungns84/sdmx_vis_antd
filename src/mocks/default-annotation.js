import * as R from 'ramda';

export const no_lastn =
  'DIM3=CODE1+CODE2,DIM6=CODE,TIME_PERIOD_START=2013-01,TIME_PERIOD_END=2018-12';

export const just_lastn = 'LASTNOBSERVATIONS=2';

export const lastn_without_val =
  'DIM3=CODE1+CODE2,DIM6=CODE,LASTNOBSERVATIONS,TIME_PERIOD_START=2013-01,TIME_PERIOD_END=2018-12';

export const withDefaultAnnotation = (content) =>
  R.over(
    R.lensPath(['data', 'dataflows', 0, 'annotations']),
    R.append({ type: 'DEFAULT', title: content }),
  );
