import { dataqueryComputor } from './dataquery';
import { lastNComputor } from './lastn';
import { routerPeriodComputor } from './router-period';

export const hclDependentsComputor =
  ({
    isTimePeriodDisable,
    dimensions,
    selection,
    automatedSelections,
    hiddenValuesAnnotation,
    contentConstraints,
    attributes,
    params,
    timePeriodBoundaries,
    timePeriodContraints,
  } = {}) =>
  ({
    currentDataquery,
    constraints,
    highlightedContraints,
    hasDataAvailability,
    currentPeriod,
    hasLastNObservations,
    currentLastNMode,
    currentLastNObservations,
  } = {}) =>
  (hierarchies) => {
    const dataquery = dataqueryComputor({
      dimensions,
      selection,
      automatedSelections,
      hiddenValuesAnnotation,
      contentConstraints,
      currentDataquery,
      constraints,
      highlightedContraints,
      hasDataAvailability,
      hierarchies,
    });

    const routerPeriod = routerPeriodComputor({
      isTimePeriodDisable,
      hasDataAvailability,
      contentConstraints,
      dimensions,
      attributes,
      params,
      dataquery,
      timePeriodBoundaries,
      timePeriodContraints,
    });

    const { lastNMode, lastNObservations, period } = lastNComputor({
      isTimePeriodDisable,
      hasLastNObservations,
      currentLastNMode,
      routerPeriod,
      currentPeriod,
      params,
      currentLastNObservations,
    });

    return {
      dataquery,
      lastNMode,
      lastNObservations,
      period,
    };
  };
