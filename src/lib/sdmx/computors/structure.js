import * as R from 'ramda';
import {
  getArtefactCategories,
  getAttributes,
  getDataflowDescription,
  getDimensions,
  getTimePeriod,
  getDataflowName,
  parseMicrodataAnnotation,
  getDefaultTableLayout,
  getExternalResources,
  getDefaultDataParams,
  getDefaultSelection,
  constrainDimensions,
} from '@sis-cc/dotstatsuite-sdmxjs';
import { rules2 } from '@sis-cc/dotstatsuite-components';
import { getDefaultCombinations } from '../../settings';
import { getAutomatedSelections } from '../selection';
import {
  getAllHiddenValuesAnnotation,
  getDSDIdentifiers,
  getDataRequestSize,
  getIsTimePeriodInversed,
  getObservationsType,
  getRelatedDataAnnotation,
  getTextAlignAnnotation,
  getAnnotations,
  getVersion,
  getDisableAvailabilityAnnotation,
} from '../accessors/structure';
import {
  getDataRequestRange,
  getIsIncreased,
  getIsTimePeriodDisable,
  getTime,
  getTimePeriodBoundaries,
  getTimePeriodContraints,
} from '../structure';
import { getHierarchicalCodelistsReferences } from '../hierarchical-codelist';
import { hclDependentsComputor } from './hcl-dependents';
import { parseContentConstraints } from '../../content-constraints';

export const structureComputor =
  ({ locale, dataflow } = {}) =>
  (structure) => {
    // version is optional and if not requested, default to response
    const { dataflowId, version, agencyId } = R.mergeRight(
      { version: getVersion(structure) }, // default
      dataflow,
    );

  const artefactId = `${agencyId}:${dataflowId}(${version})`;
  const name = getDataflowName(structure);
  const constraints = parseContentConstraints(structure);
  const dimensions = getDimensions(structure);
  const attributes = getAttributes(structure);
  const timePeriod = getTimePeriod(structure);
  const microdataDimensionId = parseMicrodataAnnotation(structure);
  const defaultLayoutIds = getDefaultTableLayout(structure);
  const externalResources = getExternalResources(structure);
  const params = getDefaultDataParams(structure);
  const selection = getDefaultSelection(structure);

  const dataRequestSize = getDataRequestSize(structure);
  const isTimePeriodDisable = getIsTimePeriodDisable(timePeriod);
  const timePeriodContraints = getTimePeriodContraints(
    isTimePeriodDisable,
    timePeriod,
    R.path(['live', 'cubeRegions'], constraints),
  );
  const timePeriodBoundaries = getTimePeriodBoundaries(timePeriodContraints);
  const automatedSelections = getAutomatedSelections(structure);
  const hiddenValuesAnnotation = getAllHiddenValuesAnnotation(structure);

  const annotations = getAnnotations(structure);
  const combinationsDefinition = R.pipe(
    rules2.getCombinationDefinitions,
    R.when(R.isEmpty, R.always(getDefaultCombinations(locale))),
  )(annotations, locale);
  const isAvailabilityDisabled = !R.isNil(
    getDisableAvailabilityAnnotation(structure),
  );

  const preparedHclDependentsComputor = hclDependentsComputor({
    isTimePeriodDisable,
    automatedSelections,
    hiddenValuesAnnotation,
    dimensions: constrainDimensions(
      dimensions,
      R.path(['live', 'cubeRegions'], constraints),
    ),
    selection,
    attributes,
    contentConstraints: R.path(['live', 'cubeRegions'], constraints),
    params,
    timePeriodContraints,
    timePeriodBoundaries,
  });

  return {
    // IN_STATE_PROPS
    hiddenValuesAnnotation,
    dimensions,
    attributes,
    microdataDimensionId,
    name,
    dataRequestRange: getDataRequestRange(dataRequestSize),
    timePeriod,
    combinationsDefinition,
    isAvailabilityDisabled,
    actualContentConstraints: R.prepend(
      R.prop('live', constraints),
      R.propOr([], 'embargoed', constraints),
    ),
    constraintId: R.path(['live', 'id'], constraints),

    // IN_CACHE_PROPS
    dataflowId,
    version: getVersion(structure),
    agencyId,
    relatedData: getRelatedDataAnnotation(structure),
    dsdIdentifiers: getDSDIdentifiers(structure),
    automatedSelections,
    externalResources,
    dataflowDescription: getDataflowDescription(structure),
    hierarchySchemes: getArtefactCategories({
      data: structure?.data,
      artefactId,
    }),
    isIncreased: getIsIncreased(dataRequestSize),
    textAlign: getTextAlignAnnotation(locale)(structure),
    observationsType: getObservationsType(structure),
    defaultLayoutIds,

      // IN_ROUTE_PROPS
      time: getTime({
        timePeriod,
        isTimePeriodInversed: getIsTimePeriodInversed(structure),
      }),

      // OTHER PROPS
      preparedHclDependentsComputor,
      hclRefs: R.pipe(getHierarchicalCodelistsReferences, R.values)(structure),
    };
  };
