import { createSelector } from 'reselect';
import * as R from 'ramda';

//------------------------------------------------------------------------------------------------#0
const getApp = R.prop('app');

//------------------------------------------------------------------------------------------------#1
export const getAppBarsOffset = createSelector(getApp, R.prop('appBarsOffset'));
export const getVisPageWidth = createSelector(getApp, R.prop('visPageWidth'));
export const getPending = createSelector(getApp, R.prop('pending'));
export const getLogs = createSelector(getApp, R.prop('logs'));
export const getUser = createSelector(getApp, R.prop('user'));
export const getToken = createSelector(getApp, R.prop('token'));
export const getIsFirstRendering = createSelector(
  getApp,
  R.prop('isFirstRendering'),
);
export const getQueryKey = (key = '') =>
  createSelector(getApp, R.pathOr([], ['queryKeys', key]));
export const getExtAuthOptions = (spaceId) =>
  createSelector(getApp, R.pathOr({}, ['extAuthOptions', spaceId]));
export const getIsUserLogged = createSelector(getUser, R.complement(R.isNil));
//------------------------------------------------------------------------------------------------#2
export const getIsPending = (id) =>
  createSelector(getPending, R.pipe(R.prop(id), R.equals(true)));
export const getLog = (name, prop = 'type') =>
  createSelector(getLogs, R.find(R.propEq(name, prop)));
