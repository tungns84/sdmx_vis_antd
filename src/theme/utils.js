import * as R from 'ramda';

export const getLight = R.path(['palette', 'tertiary', 'light']);
export const getDark = R.path(['palette', 'tertiary', 'dark']);
export const getFont = (prop) => R.path(['mixins', 'excel', prop]);
