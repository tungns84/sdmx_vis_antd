import md5 from 'md5';
import * as R from 'ramda';
import dateFns from 'date-fns';

export const hashObject = (obj) => {
  const stringifiedProperties = R.map((val) => {
    if (!R.is(Object, val)) {
      return val;
    }
    return JSON.stringify(val, Object.keys(val).sort());
  }, obj);
  const sortedString = JSON.stringify(
    stringifiedProperties,
    Object.keys(stringifiedProperties).sort(),
  );
  return md5(sortedString);
};

export const addPiTDateToArgs = constraint => {
  if (R.propEq('live', 'tag', constraint)) {
    return R.identity;
  }
  const now = new Date();
  const constraintValidDate = new Date(constraint.validFrom);
  if (!dateFns.isAfter(constraintValidDate, now)) {
    return R.identity;
  }
  return R.over(R.lensProp('headers'), R.assoc('X-Release', 'PIT'));
};

export const getDlErrorLog = error => {
  const log = error.response
    ? {
        statusCode: error.response.status,
        message: error.message,
      }
    : { error };
  return log;
};

export const isSameDataflow = (dfA, dfB) =>
  dfA.dataflowId === dfB.dataflowId &&
  dfA.agencyId === dfB.agencyId &&
  dfA.version === dfB.version &&
  dfA.datasourceId === dfB.datasourceId;
