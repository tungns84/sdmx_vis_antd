import { createSelector } from 'reselect';
import * as R from 'ramda';

const getUserState = R.prop('user');
export const getUserEmail = createSelector(getUserState, R.prop('email'));
