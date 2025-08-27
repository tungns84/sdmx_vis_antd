import * as R from 'ramda';
import dateFns from 'date-fns';
import { defaultFrequency } from '../settings';

export const sdmxFormat = {
  A: 'YYYY',
  S: 'YYYY-[S][SEMESTER]',
  Q: 'YYYY-[Q]Q',
  M: 'YYYY-MM',
  W: 'YYYY-[W]WW',
  B: 'YYYY-[W]WW',
  D: 'YYYY-MM-DD',
  H: 'YYYY-MM-DD[T]HH:mm:ss',
  N: 'YYYY-MM-DD[T]HH:mm:ss',
};

const getIsValidDate = (dateStr) =>
  R.and(dateFns.isDate, (date) => R.not(R.equals(date.getTime(date), NaN)))(
    dateFns.parse(dateStr),
  );
const isWeekInPreviousYear = (date) => {
  const startIsoWeek = dateFns.startOfISOWeek(date);
  return R.pipe(
    R.times((n) => dateFns.getYear(dateFns.addDays(startIsoWeek, n))),
    R.uniq,
    R.length,
    R.equals(1),
  )(4);
};
export const getEndOfYear = (date) => {
  if (!dateFns.isDate(date)) return undefined;
  return dateFns.endOfYear(date);
};
export const getAjustedDate = (frequency) => (date) => {
  if (R.isNil(date)) return date;
  return R.when(
    R.always(R.or(R.equals('W', frequency), R.equals('B', frequency))),
    R.ifElse(
      isWeekInPreviousYear,
      dateFns.startOfISOWeek,
      dateFns.endOfISOWeek,
    ),
  )(date);
};
const getSemesterValue = R.ifElse(
  R.pipe(Number, R.inc, R.gte(6)),
  R.always(1),
  R.always(2),
);
export const applyFormat =
  (frequency, formats = sdmxFormat, options = {}) =>
  (date) => {
    if (R.isNil(date)) return date;
    const hasFormat = R.includes(frequency)(R.keys(formats));
    const format = hasFormat
      ? R.prop(frequency)(formats)
      : R.prop(defaultFrequency)(formats);
    return R.pipe(
      getAjustedDate(frequency),
      (date) => dateFns.format(date, format, options),
      R.replace(/SEMESTER/, R.pipe(dateFns.getMonth, getSemesterValue)(date)),
    )(date);
  };
const dec = R.ifElse(R.gte(0), R.identity, R.dec);
const parseDate = (date) => dateFns.parse(date);
const addQuarters = (quarter) => (date) =>
  dateFns.addQuarters(date, dec(quarter));
const addSemesters =
  (semester = 0) =>
  (date) => {
    const number = dec(semester);
    if (R.lte(number)(0)) return date;
    return dateFns.addMonths(date, R.multiply(6)(dec(Number(semester))));
  };
const addWeeks =
  (week = 1) =>
  (date) => {
    const nbWeek = R.ifElse(R.equals(0), R.add(1), R.identity)(week);
    const dateToUse = R.ifElse(
      (date) => dateFns.isSameYear(date, dateFns.startOfISOYear(date)),
      dateFns.startOfISOYear,
      dateFns.startOfYear,
    )(dateFns.addMonths(date, 1));
    return dateFns.addWeeks(dateToUse, R.dec(nbWeek));
  };

const slicerSQW = R.pipe(R.last, R.slice(1, Infinity));

const getSQW = (fn, slicer) =>
  R.map((period) => {
    if (R.isEmpty(R.head(period))) return undefined;
    const year = R.head(period);
    const hasAdded = R.pipe(R.length, R.equals(2))(period) ? slicer(period) : 0;
    return R.pipe(parseDate, fn(Number(hasAdded)))(year);
  });

const adjustEndDate = (freq) => (date) => {
  if (R.isNil(date)) {
    return date;
  }
  const adjusters = {
    A: dateFns.endOfYear,
    S: R.pipe((d) => dateFns.add(d, 5), dateFns.endOfMonth),
    Q: dateFns.endOfQuarter,
    M: dateFns.endOfMonth,
    W: dateFns.endOfWeek,
    B: dateFns.endOfWeek,
    D: dateFns.endOfDay,
    H: dateFns.endOfHour,
    N: dateFns.endOfSecond,
  };
  const adjuster = R.prop(freq)(adjusters);
  if (R.isNil(adjuster)) {
    return date;
  }
  return adjuster(date);
};

export const parseDateFromSdmxPeriod = R.curry((frequency, sdmxPeriod) => {
  if (R.isNil(sdmxPeriod)) return sdmxPeriod;
  const periodSQW = R.map((stringPeriod = '') => R.split('-')(stringPeriod))(
    sdmxPeriod,
  );
  let res;
  if (!R.includes(frequency, ['Q', 'S', 'W', 'B'])) {
    res = R.map(R.ifElse(R.isNil, R.identity, parseDate))(sdmxPeriod);
  } else if (R.includes(frequency)(['W', 'B'])) {
    res = R.pipe(
      getSQW(addWeeks, slicerSQW),
      R.map(getAjustedDate(frequency)),
    )(periodSQW);
  } else if (R.equals('Q')(frequency))
    res = getSQW(addQuarters, slicerSQW)(periodSQW);
  else res = getSQW(addSemesters, slicerSQW)(periodSQW);
  return R.over(R.lensIndex(1), adjustEndDate(frequency))(res);
});

// -----------------------------------------------------------------------------------------Counter
const getDifferenceBetweenDates = (frequency, interval) => {
  const difference = R.propOr(
    dateFns.differenceInYears,
    frequency,
  )({
    A: dateFns.differenceInYears,
    S: R.pipe(dateFns.differenceInMonths, R.flip(R.divide)(6), Math.floor),
    Q: dateFns.differenceInQuarters,
    M: dateFns.differenceInMonths,
    W: dateFns.differenceInWeeks,
    B: dateFns.differenceInWeeks,
    D: dateFns.differenceInDays,
    H: dateFns.differenceInHours,
    N: dateFns.differenceInMinutes,
  });
  return difference(R.last(interval), R.head(interval));
};

const addTimeList = {
  A: dateFns.addYears,
  S: (date, v) => dateFns.addMonths(date, v * 6),
  Q: dateFns.addQuarters,
  M: dateFns.addMonths,
  W: dateFns.addWeeks,
  B: dateFns.addWeeks,
  D: dateFns.addDays,
  H: dateFns.addHours,
  N: dateFns.addMinutes,
};

// ---------------------------------------------------------------------------------------------API
export const getFrequencyFromSdmxPeriod = (sdmxPeriod) => {
  if (R.isNil(sdmxPeriod)) return null;
  return R.reduce((memo, sdmxDate) => {
    if (R.either(R.isNil, R.isEmpty)(sdmxDate)) return memo;
    const splitedSdmxDate = R.split('-')(sdmxDate);
    const potentialFrequency = R.pipe(
      R.nth(1),
      R.when(R.isNil, R.always('')),
      R.head,
    )(splitedSdmxDate);
    if (R.includes(potentialFrequency)(['Q', 'S', 'W', 'B']))
      return potentialFrequency;
    if (R.length(splitedSdmxDate) === 2) return 'M';
    if (R.length(splitedSdmxDate) === 3) return 'D';
    return memo;
  }, defaultFrequency)(sdmxPeriod);
};

export const getFrequencies = R.pipe(
  R.propOr([], 'values'),
  R.map(R.props(['id', 'label'])),
  R.fromPairs,
);

export const parseInclusiveDates =
  (inclusives, frequency = defaultFrequency) =>
  (dates) => {
    const addTime = R.prop(frequency)(addTimeList);
    return R.addIndex(R.map)((date, index) => {
      if (R.isNil(date)) return date;
      const isInclusive = R.nth(index)(inclusives);
      if (R.either(R.identity, R.isNil)(isInclusive)) return date;
      if (R.equals(0, index)) return addTime(date, 1);
      return addTime(date, -1);
    })(dates);
  };

export const getAscendentDates = (dates) => {
  const startDate = R.head(dates);
  const endDate = R.last(dates);
  if (R.pipe(dateFns.compareAsc, R.flip(R.lte)(0))(startDate, endDate))
    return dates;
  return [undefined, undefined];
};

export const replaceUndefinedDates = (boundaries) =>
  R.addIndex(R.map)((date, index) => {
    return getIsValidDate(date) ? date : R.nth(index)(boundaries);
  });

export const getDatesFromSdmxPeriod = R.curry((frequencyType, period) =>
  R.map(R.ifElse(getIsValidDate, R.identity, R.always(undefined)))(
    parseDateFromSdmxPeriod(frequencyType, period),
  ),
);

export const getSdmxPeriod = R.curry((frequency, date) =>
  R.ifElse(getIsValidDate, applyFormat(frequency), R.always(undefined))(date),
);

export const getIntervalPeriod =
  (datesBoundaries) =>
  (frequency, dates = []) => {
    if (R.isNil(dates))
      return [0, getDifferenceBetweenDates(frequency, datesBoundaries) + 1];
    if (R.all(R.isNil)(dates))
      return [0, getDifferenceBetweenDates(frequency, datesBoundaries) + 1];
    return [
      getDifferenceBetweenDates(
        frequency,
        replaceUndefinedDates(datesBoundaries)(dates),
      ) + 1,
      getDifferenceBetweenDates(frequency, datesBoundaries) + 1,
    ];
  };

export const changeFrequency = (frequency) =>
  R.pipe(
    R.keys,
    R.ifElse(R.includes(frequency), R.always(frequency), R.head),
    R.ifElse(
      R.either(R.isEmpty, R.isNil),
      R.always(defaultFrequency),
      R.identity,
    ),
  );
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const getSubstructedDate = (date, value, _freq) => {
  const freq = R.isNil(_freq) ? defaultFrequency : _freq;
  const isValid = getIsValidDate(date);
  if (R.isNil(value) || !isValid) return;
  let newDate = date;
  if (freq === 'A') {
    newDate = dateFns.addYears(date, -value + 1);
  }
  if (freq === 'S') {
    newDate = dateFns.addMonths(date, (-value + 1) * 6);
  }
  if (freq === 'Q') {
    newDate = dateFns.addMonths(date, (-value + 1) * 3);
  }
  if (freq === 'M') {
    newDate = dateFns.addMonths(date, -value + 1);
  }
  if (freq === 'W' || freq === 'B') {
    newDate = dateFns.addDays(date, (-value + 1) * 7);
  }
  if (freq === 'D') {
    newDate = dateFns.addDays(date, -value + 1);
  }
  if (freq === 'H') {
    newDate = dateFns.addHours(date, -value + 1);
  }
  if (freq === 'N') {
    newDate = dateFns.addMinutes(date, -value + 1);
  }
  newDate = dateFns.addSeconds(newDate, -value + 1);
  return newDate;
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const compareDates = (date1, date2, accessor) => {
  let newDate;

  if (date1 && date2) {
    newDate = accessor(date1, date2);
  } else if (date1) {
    newDate = date1;
  } else if (date2) {
    newDate = date2;
  } else {
    // Both dates are undefined
    newDate = undefined;
  }
  return newDate;
};
