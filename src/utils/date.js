import dateFns from 'date-fns';
import * as R from 'ramda';

// only to new date
export const dateWithoutTZ = (date) =>
  dateFns.addMinutes(date, date.getTimezoneOffset());

export const getDateInTheRange = (boundaries) => (date) => {
  if (R.isNil(boundaries)) return boundaries;
  if (R.includes(undefined, boundaries)) return undefined;
  if (R.isNil(date)) return date;
  return dateFns.isWithinRange(date, ...boundaries)
    ? date
    : dateFns.closestTo(date, boundaries);
};
