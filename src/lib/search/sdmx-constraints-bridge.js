import * as R from 'ramda';
import { isFrequencyDimension } from '@sis-cc/dotstatsuite-sdmxjs';
import { isPerfectMatch } from '../../utils';
import { computeLevelSelections } from '../sdmx/selection';

const matchConstraintId = R.match(/#(.*?)#/g);
export const searchConstraintsToVisConstraints = R.pipe(
  R.values,
  R.map(
    R.evolve({
      constraintId: R.ifElse(
        R.pipe(matchConstraintId, R.isEmpty),
        R.identity,
        R.pipe(matchConstraintId, R.last, R.replace(/#/g, '')), // IE doesn't get /(?<=#)(.*?)(?=#)/g
      ),
    }),
  ),
  R.groupBy(R.prop('facetId')),
);

export const hlConstraintsToVisConstraints = R.reduce(
  (acc, [field, highlights]) => {
    const ids = R.reduce(
      (_acc, { label, valueId }) =>
        isPerfectMatch(label) ? R.append(valueId, _acc) : _acc,
      [],
      highlights,
    );
    return R.isEmpty(ids) ? acc : R.assoc(field, ids, acc);
  },
  {},
);

const rejectNotDisplayedValueIds = R.reduce((acc, value) => {
  if (value.display === false) return acc;
  return R.append(value.id, acc);
}, []);

export const searchConstraintsToVisSelection = (
  dimensions,
  constraints,
  highlights,
) => {
  const visContraints = searchConstraintsToVisConstraints(constraints);
  const hlConstraints = hlConstraintsToVisConstraints(highlights);

  return R.reduce(
    (selection, dimension) => {
      // empty dimension is possible, don't remember the usecase (cf dimitri)
      if (R.isEmpty(dimension)) return selection;
      // from user or search not displayed dimension cannot be selected or unselected
      // see ticket https://gitlab.com/sis-cc/.stat-suite/dotstatsuite-data-explorer/-/issues/672
      if (dimension.display === false) return selection;

      const dimensionLabel = R.prop('label')(dimension);
      const id = R.prop('id', dimension);
      const valueIds = new Set(
        R.pipe(R.propOr([], 'values'), rejectNotDisplayedValueIds)(dimension),
      );
      if (R.has(dimensionLabel, visContraints)) {
        const dimensionSelection = R.pipe(
          R.prop(dimensionLabel),
          R.pluck('constraintId'),
          R.filter((id) => valueIds.has(id)),
        )(visContraints);

        return R.assoc(id, dimensionSelection, selection);
      }
      if (R.has(dimensionLabel, hlConstraints)) {
        const dimensionSelection = R.filter(
          (id) => valueIds.has(id),
          R.prop(dimensionLabel, hlConstraints),
        );
        return R.isEmpty(dimensionSelection)
          ? selection
          : R.assoc(id, dimensionSelection, selection);
      }

      return selection;
    },
    {},
    dimensions,
  );
};

export const getDefaultSelection = (
  dimensions,
  structureSelection,
  constraints,
  highlightedConstraints,
  hierarchies,
) => {
  const searchSelection = R.mergeRight(
    structureSelection,
    searchConstraintsToVisSelection(
      dimensions,
      constraints,
      highlightedConstraints,
    ),
  );

  return R.pipe(
    R.reduce((acc, dimension) => {
      const id = R.prop('id')(dimension);
      let selectedValues = R.prop(id)(searchSelection);
      if (R.or(R.isNil(id), R.isNil(selectedValues))) {
        if (isFrequencyDimension(dimension)) {
          const selectableValues = R.pipe(
            R.propOr([], 'values'),
            R.filter(R.prop('hasData')),
          )(dimension);
          if (R.length(selectableValues) === 1) {
            return R.assoc(id, [R.head(selectableValues).id], acc);
          }
        }
        return acc;
      }
      const hasLevelSelection = R.match(
        /LEVEL([\d]+)/,
        R.join(',', selectedValues),
      );
      if (hasLevelSelection) {
        selectedValues = computeLevelSelections(
          selectedValues,
          dimension,
          R.prop(dimension.id, hierarchies),
        );
      }
      const valueIds = new Set(
        R.pipe(R.propOr([], 'values'), R.pluck('id'))(dimension),
      );
      return R.assoc(
        id,
        R.filter((id) => valueIds.has(id))(selectedValues),
      )(acc);
    }, {}),
    R.reject(R.isEmpty),
  )(dimensions);
};
