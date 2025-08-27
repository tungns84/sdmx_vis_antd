import * as R from 'ramda';
import { useSelector } from 'react-redux';
import { getPeriod } from '../../selectors/router';
import {
  getDataRequestArgs,
  getTimePeriodArtefact,
} from '../../selectors/sdmx';

export default () => {
  const requestArgs = useSelector(getDataRequestArgs);
  const routerPeriod = useSelector(getPeriod);
  const timePeriodArtefact = useSelector(getTimePeriodArtefact);

  // if router period is null, it means that no period was defined by the user
  // fallback to settings, annotations, ACC request is made and
  // 'period' is coming from requestArgs
  //
  // router period is not updated to allow url sharing with options like lastn periods
  // not defined explicitely on url but in annotation or settings
  //
  // if router period is an array, it's applied on priority even if it's an empty array
  // to allow user to perform blank request
  // (it has to be explicit in the url)

  const params = requestArgs?.params;
  const hasPeriod = !!params?.startPeriod || !!params?.endPeriod;
  const hasRouterPeriod = R.is(Array, routerPeriod);
  const hasNoTime = R.isNil(timePeriodArtefact);

  const hasTime = hasRouterPeriod || hasPeriod || hasNoTime;

  return { hasTime };
};
