import * as R from 'ramda';
import { renameKeys } from '../../../utils';
import { getNotDisplayedCombinations } from '@sis-cc/dotstatsuite-sdmxjs';

/*
 * structure accessors should always and only take a valid SDMX structure as param
 * basic format of an accesor is: structure => {}
 * if a context is needed, use a fof: ctx => structure => {}
 */

const DFs = 'dataflows';
const DSDs = 'dataStructures';

const getHeadDataByKey = (key) => R.pathOr({}, ['data', key, 0]);
export const getDataStructure = getHeadDataByKey(DSDs);
export const getDataflow = getHeadDataByKey(DFs);
const getAnnotationsByKey = (key) =>
  R.pipe(getHeadDataByKey(key), R.propOr([], 'annotations'));
export const getDataStructureAnnotations = getAnnotationsByKey(DSDs);
export const getDataflowAnnotations = getAnnotationsByKey(DFs);

export const getDataIncreaseAnnotation = R.pipe(
  getDataflowAnnotations,
  R.find(R.propEq('MAX_TABLE_DATA', 'type')),
);

export const getHiddenValuesAnnotation = (accessor) => (structure) =>
  R.pipe(accessor, R.find(R.propEq('NOT_DISPLAYED', 'type')))(structure);

export const getObservationsType = R.pipe(
  getDataStructure,
  R.path([
    'dataStructureComponents',
    'measureList',
    'primaryMeasure',
    'localRepresentation',
    'textFormat',
    'textType',
  ]),
);

const haslayoutCellAlign = (accessor) => (structure) =>
  R.pipe(accessor, R.find(R.propEq('LAYOUT_CELL_ALIGN', 'type')))(structure);

export const getTextAlignAnnotation = (locale) =>
  R.pipe(
    R.either(
      haslayoutCellAlign(getDataflowAnnotations),
      haslayoutCellAlign(getDataStructureAnnotations),
    ),
    R.either(R.path(['texts', locale]), R.prop('title')),
  );

export const getDataRequestSize = (structure) => {
  const dataIncreaseAnnotation = getDataIncreaseAnnotation(structure);
  if (R.isNil(dataIncreaseAnnotation)) return null;
  return R.pipe(R.prop('title'), Number, (v) => (isNaN(v) ? null : v))(
    dataIncreaseAnnotation,
  );
};

export const getAllHiddenValuesAnnotation = (structure) => {
  return R.pipe(
    R.either(
      getHiddenValuesAnnotation(getDataflowAnnotations),
      getHiddenValuesAnnotation(getDataStructureAnnotations),
    ),
    R.ifElse(R.isNil, R.always({}), getNotDisplayedCombinations),
  )(structure);
};

const hasTimePeriodDesc = (accessor) => (structure) => {
  return R.pipe(
    accessor,
    R.find(R.propEq('LAYOUT_TIME_PERIOD_DESC', 'type')),
    R.complement(R.isNil),
  )(structure);
};

export const getIsTimePeriodInversed = R.either(
  hasTimePeriodDesc(getDataflowAnnotations),
  hasTimePeriodDesc(getDataStructureAnnotations),
);

export const getDSDIdentifiers = R.pipe(
  getDataStructure,
  R.pickAll(['agencyID', 'id', 'version']),
  renameKeys({ id: 'code', agencyID: 'agencyId' }),
);

export const getAnnotations = R.converge(R.concat, [
  getDataflowAnnotations,
  getDataStructureAnnotations,
]);

export const getRelatedDataAnnotation = R.pipe(
  getAnnotations,
  R.find(R.propEq('RELATED_DATA', 'type')),
  (annot) => annot?.title,
);

export const getVersion = R.pipe(getDataflow, R.prop('version'));

export const getDisableAvailabilityAnnotation = R.pipe(
  getAnnotations,
  R.find(R.propEq('DISABLE_AVAILABILITY_REQUESTS', 'type')),
);
