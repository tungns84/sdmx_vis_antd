import { createSelector } from 'reselect';
import * as R from 'ramda';
import { rules, rules2 } from '@sis-cc/dotstatsuite-components';
import { getDataflow, getDisplay } from './router';
import {
  getData,
  getDataflowName,
  getHCodes,
  getParsedAttributes,
  getCombinationsDefinition,
} from './sdmx';
import { getDimensionId as getMicrodataDimensionId } from './microdata';
import { getCustomAttributes } from './index';
import {
  getSeriesAdvancedAttributes as metadataLib_getSeriesAdvancedAttributes,
  getHeaderAdvancedAttributes as metadataLib_getHeaderAdvancedAttributes,
} from '../lib/sdmx/metadata';

export const getMetadataCoordinates = createSelector(getData, (data) =>
  rules2.getMetadataCoordinates({ data }),
);

export const getDataAttributes = createSelector(
  getData,
  R.pathOr([], ['structure', 'attributes', 'observation']),
);

export const getDataDimensions = createSelector(
  getData,
  R.pathOr([], ['structure', 'dimensions', 'observation']),
);

export const getOneValueDimensions = createSelector(
  getDataDimensions,
  getParsedAttributes,
  getCustomAttributes,
  (dimensions, attributes) =>
    rules2.getOneValueDimensions(dimensions, attributes),
);

export const getHeaderCoordinates = createSelector(
  getOneValueDimensions,
  (oneValueDimensions) => rules2.getHeaderCoordinates(oneValueDimensions),
);

export const getParsedCombinations = createSelector(
  getCombinationsDefinition,
  getParsedAttributes,
  getDataDimensions,
  (combinations, parsedAttributes, dimensions) =>
    rules2.parseCombinations(combinations, parsedAttributes, dimensions),
);

export const getSeriesCombinations = createSelector(
  getParsedCombinations,
  getOneValueDimensions,
  (combinations, oneValueDimensions) =>
    rules2.getSeriesCombinations(combinations, oneValueDimensions),
);

export const getRefinedAttributes = createSelector(
  getParsedAttributes,
  getSeriesCombinations,
  (parsedAttributes, seriesCombinations) =>
    rules2.refineAttributes(parsedAttributes, seriesCombinations),
);

export const getDataObservations = createSelector(getData, (data) =>
  rules.getObservations({ data }),
);

export const getEnhancedObservations = createSelector(
  getDataObservations,
  getRefinedAttributes,
  getDataDimensions,
  getCustomAttributes,
  (observations, attributes, dimensions, customAttributes) =>
    rules2.enhanceObservations(dimensions, observations, attributes, {
      customAttributes,
    }),
);

export const getAttributesSeries = createSelector(
  getEnhancedObservations,
  (observations) => rules2.getAttributesSeries(observations),
);

export const getSeriesAdvancedAttributes = createSelector(
  getAttributesSeries,
  getParsedCombinations,
  getCustomAttributes,
  (attributesSeries, combinations, customAttributes) =>
    metadataLib_getSeriesAdvancedAttributes(
      attributesSeries,
      combinations,
      customAttributes,
    ),
);

export const getHeaderAdvancedAttributes = createSelector(
  getRefinedAttributes,
  getDataDimensions,
  getParsedCombinations,
  getCustomAttributes,
  (attributes, dimensions, combinations, customAttributes) =>
    metadataLib_getHeaderAdvancedAttributes(
      attributes,
      dimensions,
      combinations,
      customAttributes,
    ),
);

export const getAdvancedAttributes = createSelector(
  getSeriesAdvancedAttributes,
  getHeaderAdvancedAttributes,
  (seriesAttrs, headerAttrs) => ({ ...seriesAttrs, ...headerAttrs }),
);

export const getManyValuesDimensions = createSelector(
  getDataDimensions,
  getAttributesSeries,
  getCustomAttributes,
  getSeriesCombinations,
  (dimensions, attributesSeries, customAttributes, combinations) =>
    rules2.getManyValuesDimensions(
      dimensions,
      attributesSeries,
      customAttributes,
      combinations,
    ),
);

export const getHierarchisedDimensions = createSelector(
  getManyValuesDimensions,
  getHCodes,
  (dimensions, hierarchies) =>
    R.map((dim) => {
      if (R.isEmpty(R.propOr({}, dim.id, hierarchies))) {
        return rules2.hierarchiseDimensionWithNativeHierarchy(dim);
      }
      return rules2.applyHierarchicalCodesToDim(
        R.prop(dim.id, hierarchies),
        dim,
      );
    }, dimensions),
);

export const getObsAttributes = createSelector(
  getRefinedAttributes,
  R.filter(
    (a) => a.series && R.isEmpty(a.relationship) && a.display && !a.combined,
  ),
);

export const getDuplicatedObservations = createSelector(
  getEnhancedObservations,
  getHierarchisedDimensions,
  (observations, hierarchisedDimensions) => {
    return rules2.duplicateObs(R.values(hierarchisedDimensions), observations);
  },
);

export const getHeaderCombinations = createSelector(
  getParsedCombinations,
  getOneValueDimensions,
  getRefinedAttributes,
  getDisplay,
  (combinations, dimensions, attributes, display) =>
    rules2.getHeaderCombinations(combinations, dimensions, attributes, display),
);

export const getVisDataflow = createSelector(
  getDataflow,
  getDataflowName,
  (dataflow, name) => ({
    id: dataflow.dataflowId,
    name,
  }),
);

export const getDefaultTitleLabel = createSelector(
  getVisDataflow,
  getDisplay,
  (dataflow, display) => rules.dimensionValueDisplay(display)(dataflow),
);

export const getDataflowAttributes = createSelector(
  getParsedAttributes,
  getParsedCombinations,
  (attributes, combinations) =>
    rules2.getDataflowAttributes(attributes, combinations),
);

export const getHeaderTitle = createSelector(
  getVisDataflow,
  getDataflowAttributes,
  getDisplay,
  getCustomAttributes,
  (dataflow, attributes, display, customAttributes) =>
    rules2.getHeaderTitle(dataflow, attributes, display, customAttributes),
);

export const getHeaderSubtitle = createSelector(
  getOneValueDimensions,
  getParsedCombinations,
  getCustomAttributes,
  getDisplay,
  getMicrodataDimensionId,
  (dimensions, combinations, customAttributes, display, microdataDimension) =>
    rules2.getHeaderSubtitle(
      dimensions,
      combinations,
      customAttributes,
      display,
      microdataDimension,
    ),
);

export const getHeaderProps = createSelector(
  getHeaderTitle,
  getHeaderSubtitle,
  getHeaderCombinations,
  (title, subtitle, combinations) => ({
    title,
    subtitle,
    combinations,
  }),
);
