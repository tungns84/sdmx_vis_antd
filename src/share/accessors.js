import * as R from 'ramda';

//------------------------------------------------------------------------------------------------#1
export const getChartStatus = R.prop('chartStatus');
export const getList = R.prop('list');
export const getConfirmUrl = R.prop('confirmUrl');
export const getLog = (name, prop = 'type') =>
  R.pipe(R.propOr([], 'logs'), R.find(R.propEq(name, prop)));
export const getIsPending = (id) =>
  R.pipe(R.prop('pending'), R.prop(id), R.equals(true));
