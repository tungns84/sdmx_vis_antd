import * as R from 'ramda';
import { getDefaultRouterParams } from '..';
import { getFrequencyArtefact } from '@sis-cc/dotstatsuite-sdmxjs';

export const routerPeriodComputor = ({
  isTimePeriodDisable,
  hasDataAvailability,
  contentConstraints,
  dimensions,
  attributes,
  params,
  dataquery,
  timePeriodBoundaries,
  timePeriodContraints,
}) => {
  if (isTimePeriodDisable) return null;

  const hasValidDataAvailability =
    hasDataAvailability && !R.isEmpty(contentConstraints);

  const { period: routerPeriod } = getDefaultRouterParams({
    hasDataAvailability: hasValidDataAvailability,
    frequencyArtefact: getFrequencyArtefact({ dimensions, attributes }),
    params,
    dataquery,
    timePeriodBoundaries,
    inclusiveBoundaries: R.propOr(
      [true, true],
      'includingBoundaries',
      timePeriodContraints,
    ),
  });

  return routerPeriod;
};
