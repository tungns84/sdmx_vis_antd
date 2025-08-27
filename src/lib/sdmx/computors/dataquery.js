import * as R from 'ramda';
import {
  getActualContentConstraintsDefaultSelection,
  getDataquery,
} from '@sis-cc/dotstatsuite-sdmxjs';
import { parseDataquery, selectAutomatedSelections } from '../selection';
import { getDefaultSelection } from '../../search/sdmx-constraints-bridge';

const filterByAnnotationMaybe = (hiddenValuesAnnotation) => {
  return R.filter((dim) =>
    R.pipe(R.propOr([], 'values'), (values) =>
      hiddenValuesAnnotation[dim.id]
        ? !R.isEmpty(
            R.difference(hiddenValuesAnnotation[dim.id], R.pluck('id')(values)),
          )
        : true,
    )(dim),
  );
};

const computeDefaultSelection = ({
  hiddenValuesAnnotation,
  constraints,
  highlightedContraints,
  contentConstraints = {},
  hasDataAvailability,
  dimensions,
  selection,
  hierarchies,
}) => {
  const hasValidDataAvailability =
    hasDataAvailability && !R.isEmpty(contentConstraints || []);

  return R.pipe(
    filterByAnnotationMaybe(hiddenValuesAnnotation),
    (dimensions) =>
      getDefaultSelection(
        dimensions,
        selection,
        constraints,
        highlightedContraints,
        hierarchies,
      ),
    (selection) =>
      hasValidDataAvailability
        ? getActualContentConstraintsDefaultSelection({
            selection,
            contentConstraints,
          })
        : selection,
    R.reject(R.isEmpty),
  )(dimensions);
};

export const dataqueryComputor = ({
  currentDataquery,
  dimensions,
  automatedSelections,
  hierarchies,
  hiddenValuesAnnotation,
  constraints, // facet selection
  highlightedContraints, // highlights from search
  contentConstraints, // actual contentConstraint from structure
  hasDataAvailability,
  selection,
}) => {
  const refinedSelection = R.isEmpty(currentDataquery)
    ? computeDefaultSelection({
        hiddenValuesAnnotation,
        constraints,
        highlightedContraints,
        contentConstraints,
        hasDataAvailability,
        dimensions,
        selection,
        hierarchies,
      })
    : parseDataquery(currentDataquery, dimensions);

  return R.pipe(
    (selection) =>
      selectAutomatedSelections(
        selection,
        dimensions,
        automatedSelections,
        hierarchies,
      ),
    (selection) => getDataquery(dimensions, selection),
  )(refinedSelection);
};
