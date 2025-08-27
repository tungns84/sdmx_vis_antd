import { rules2 } from '@sis-cc/dotstatsuite-components';
import * as R from 'ramda';
import { DISPLAY_CODE, DISPLAY_LABEL } from '../../utils/constants';

const getObservations = R.path(['dataSets', 0, 'observations']);
const getArtefacts = (type) => R.path(['structure', type, 'observation']);
const getDimensions = getArtefacts('dimensions');
const getAttributes = getArtefacts('attributes');
const getAnnotationsByType = (type) =>
  R.converge(R.pipe(R.pickAll, R.values, R.filter(R.propEq(type, 'type'))), [
    R.pathOr([], ['dataSets', 0, 'annotations']),
    R.pathOr([], ['structure', 'annotations']),
  ]);
const getValues = R.prop('values');
const parseKey = R.split(':');

const getValuedArtefacts = ({ useDisplay = true, type } = {}) =>
  R.reduce((memo, artefact) => {
    let res = artefact;
    if (R.pipe(getValues, R.isEmpty)(artefact)) return memo;
    if (useDisplay && R.propEq(false, 'display', artefact)) return memo;
    if (type) res.type = type;
    return R.append(R.pick(['id', 'name', 'type'])(res), memo);
  }, []);

const drilldownFork = (hasDrilldownConcepts, drilldownConcepts) =>
  R.ifElse(
    R.always(hasDrilldownConcepts),
    R.pick(
      R.pipe(R.pluck('title'), R.join(','), R.split(','))(drilldownConcepts),
    ),
    R.identity,
  );

export const prepareTableColumns = (data) => {
  if (R.isNil(data)) return;
  const drilldownConcepts = getAnnotationsByType('DRILLDOWN_CONCEPTS')(data);
  const hasDrilldownConcepts = !R.isEmpty(drilldownConcepts);
  const dimensions = R.pipe(
    getDimensions,
    R.indexBy(R.prop('id')),
    drilldownFork(hasDrilldownConcepts, drilldownConcepts),
    R.values,
  )(data);
  const attributes = R.pipe(
    getAttributes,
    R.indexBy(R.prop('id')),
    drilldownFork(hasDrilldownConcepts, drilldownConcepts),
    R.values,
  )(data);
  return [
    ...getValuedArtefacts({
      useDisplay: !hasDrilldownConcepts,
      type: 'dimension',
    })(dimensions),
    ...getValuedArtefacts({
      useDisplay: !hasDrilldownConcepts,
      type: 'attribute',
    })(attributes),
    { id: 'value', align: 'right' },
  ];
};

const hierarchiseCodelist = (codelist, hierarchies) => {
  if (R.length(codelist.values || []) < 2) {
    return codelist;
  }
  if (R.has(codelist.id, hierarchies)) {
    return rules2.applyHierarchicalCodesToDim(
      R.prop(codelist.id, hierarchies),
      codelist,
    );
  }
  return rules2.hierarchiseDimensionWithNativeHierarchy(codelist);
};

// obs = [[key, val]]
export const extractArtefactValues = (codelists, observations) => {
  return R.addIndex(R.reduceRight)(
    (codelist, acc, conceptIndex) => {
      if (!(R.length(getValues(codelist) || []) >= 1)) {
        return acc;
      }
      const codelistIndex = R.prop('__index', codelist);
      const groupedObs = R.groupBy(
        codelist.isAttribute
          ? R.pipe(
              R.nth(1),
              R.tail,
              R.nth(codelistIndex),
              R.when(R.isNil, R.always('0')),
            )
          : R.pipe(R.head, parseKey, R.nth(codelistIndex)),
        acc,
      );
      const type = codelist.isAttribute ? 'attribute' : 'dimension';

      const duplicated = R.map(
        (codelistValue) => {
          const matchingObs = R.propOr(
            [],
            R.prop('__index', codelistValue),
            groupedObs,
          );
          return R.map(
            (obs) =>
              R.pipe(
                R.when(
                  (o) => R.length(o) === 2,
                  (o) => R.append({ value: R.pipe(R.nth(1), R.head)(o) }, o),
                ),
                R.over(R.lensIndex(2), (artefacts) => {
                  const artefact = {
                    artefact: codelist, //R.pick(['id', 'name'], codelist),
                    value: codelistValue,
                    type,
                  };
                  return R.assoc(codelist.id, artefact, artefacts);
                }),
                R.when(
                  R.always(conceptIndex === R.length(codelists) - 1),
                  R.last,
                ),
              )(obs),
            matchingObs,
          );
        },
        getValues(codelist) || [],
      );
      return R.unnest(duplicated);
    },
    observations,
    codelists,
  );
};

export const getMissingRows = (serie, previousSerie, columns) => {
  let sameSerie = true;
  const missingRows = [];
  const row = R.addIndex(R.reduce)(
    (onGoingSerie, column, columnIndex) => {
      const prevCellValue = sameSerie
        ? R.nth(columnIndex, previousSerie || []) || {}
        : {};
      const prevCellIndex = R.pathOr(
        -1,
        ['value', '__indexPosition'],
        prevCellValue,
      );
      const _cellValue = R.prop(column.id, serie);
      if (!R.is(Object, _cellValue)) {
        return R.append(_cellValue, onGoingSerie);
      }
      const cellValue = R.over(
        R.lensProp('artefact'),
        R.pick(['id', 'name']),
        _cellValue,
      );
      const prevParents = new Set(
        R.pathOr([], ['value', 'parents'], prevCellValue),
      );
      const _parentsIndexes = R.pathOr([], ['value', 'parents'], cellValue);

      const parentsIndexes = R.reduce(
        (_acc, parentIndex) => {
          const parentValue = R.pathOr(
            {},
            ['artefact', 'values', parentIndex],
            _cellValue,
          );
          if (parentIndex > prevCellIndex && parentValue.isSelected) {
            const onGoingSet = new Set(_acc);
            const _parentValue = R.over(
              R.lensProp('parents'),
              R.filter((ind) => prevParents.has(ind) || onGoingSet.has(ind)),
              parentValue,
            );
            const missingRow = R.pipe(
              R.append({ ...cellValue, value: _parentValue }),
              (row) =>
                R.concat(
                  row,
                  R.times(R.always(null), R.length(columns) - columnIndex - 1),
                ),
            )(onGoingSerie);
            missingRows.push(missingRow);
            return R.append(parentIndex, _acc);
          } else if (
            prevParents.has(parentIndex) ||
            parentIndex === prevCellIndex
          ) {
            return R.append(parentIndex, _acc);
          }
          return _acc;
        },
        [],
        _parentsIndexes,
      );

      if (R.path(['value', '__indexPosition'], cellValue) !== prevCellIndex) {
        sameSerie = false;
      }
      return R.append(
        R.set(R.lensPath(['value', 'parents']), parentsIndexes, cellValue),
        onGoingSerie,
      );
    },
    [],
    columns,
  );

  return R.append(row, missingRows);
};

export const getDrilldownCodelists = (
  data,
  hierarchies,
  automatedSelections,
  dataquery = '',
) => {
  const _drilldownConcepts = R.pipe(
    getAnnotationsByType('DRILLDOWN_CONCEPTS'),
    R.pluck('title'),
    R.join(','),
    R.split(','),
  )(data);
  const drilldownConcepts =
    R.isEmpty(_drilldownConcepts) || R.isEmpty(R.head(_drilldownConcepts))
      ? R.converge(
          (dimsIds, attrsIds) => R.concat(dimsIds, attrsIds),
          [
            R.pipe(getDimensions, R.pluck('id')),
            R.pipe(getAttributes, R.pluck('id')),
          ],
        )(data)
      : _drilldownConcepts;
  const indexedDimensions = R.pipe(
    getDimensions,
    (dims) => rules2.refineDimensions(dims, dataquery),
    R.indexBy(R.prop('id')),
  )(data);
  const indexedAttributes = R.pipe(
    getAttributes,
    R.indexBy(R.prop('id')),
  )(data);
  return R.reduce(
    (memo, concept) => {
      if (
        !R.has(concept, indexedDimensions) &&
        !R.has(concept, indexedAttributes)
      ) {
        return memo;
      }
      const isAttribute = R.has(concept, indexedAttributes);
      const codelist = R.prop(
        concept,
        isAttribute ? indexedAttributes : indexedDimensions,
      );
      const hierarchisedCodelist = hierarchiseCodelist(codelist, hierarchies);
      const automatedSelectedLevels = new Set(
        R.propOr([], concept, automatedSelections),
      );
      const refined = R.over(
        R.lensProp('values'),
        R.map((val) => {
          const parents = R.propOr([], 'parents', val);
          const level = R.length(parents);
          return {
            ...val,
            isSelected:
              !automatedSelectedLevels.size ||
              automatedSelectedLevels.has(level),
          };
        }),
        hierarchisedCodelist,
      );
      return R.append(
        {
          ...refined,
          [`${isAttribute ? 'isAttribute' : 'isDimension'}`]: true,
        },
        memo,
      );
    },
    [],
    drilldownConcepts,
  );
};

export const prepareTableRows = (
  data,
  hierarchies = {},
  automatedSelections = {},
  dataquery = '',
) => {
  if (R.isNil(data)) return;
  const drilldownCodelists = getDrilldownCodelists(
    data,
    hierarchies,
    automatedSelections,
    dataquery,
  );
  const observations = getObservations(data);
  return R.pipe(R.toPairs, (obs) =>
    extractArtefactValues(drilldownCodelists, obs),
  )(observations);
};

export const getDescendants = (refId, flatList = []) => {
  const descendants = {};

  const recurse = (list) => {
    const nextList = R.reduce(
      (memo, node) => {
        const id = R.prop('id', node);
        const parentId = R.prop('parentId', node);
        if (R.equals(id, refId)) {
          descendants[id] = node;
          return memo;
        }
        if (R.isNil(parentId)) return memo;
        if (R.equals(parentId, refId)) {
          descendants[id] = node;
          return memo;
        }
        if (R.has(parentId, descendants)) {
          descendants[id] = node;
          return memo;
        }
        return R.append(node, memo);
      },
      [],
      list,
    );

    if (R.length(list) === R.length(nextList)) return;
    return recurse(nextList);
  };

  recurse(flatList);

  return R.keys(descendants);
};

export const getDescendantsFromHCL = (parentId, hierarchy) => {
  const hierarchicalKeys = R.keys(hierarchy);
  const parentRelatedKeys = R.filter(
    (key) =>
      R.includes(`${parentId}.`, key) ||
      R.endsWith(`.${parentId}`, key) ||
      key === parentId,
    hierarchicalKeys,
  );
  return R.pipe(
    R.props(parentRelatedKeys),
    R.unnest,
    R.uniq,
    R.append(parentId),
  )(hierarchy);
};

export const displayAccessor =
  ({ display = DISPLAY_LABEL } = {}) =>
  (artefact = {}) => {
    const code = R.propOr('', 'id', artefact);
    const label = R.propOr('', 'name')(artefact);
    if (R.equals(display, DISPLAY_CODE)) return code;
    if (R.equals(display, DISPLAY_LABEL)) return label;
    if (R.isEmpty(code)) return label;
    return `(${code}) ${label}`;
  };
