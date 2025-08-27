import { createSelector } from 'reselect';
import * as R from 'ramda';
import {
  getRequestArgs,
  getDataquery as getDataqueryMicrodata,
} from '@sis-cc/dotstatsuite-sdmxjs';
import { rules2 } from '@sis-cc/dotstatsuite-components';
import {
  getMicrodataConstraints,
  getViewer,
  getDisplay,
  getDataflow,
  getLocale,
} from './router';
import { getCustomAttributes } from './index';
import {
  getRawStructureRequestArgs,
  getDataRequestParams,
  getExternalReference,
  getDimensions,
  getTimePeriodArtefact,
  getDataRequestRange,
  getDataflowName,
  getAnnotations,
  getHierarchies,
} from './sdmx';
import { getDescendants, getDescendantsFromHCL } from '../lib/sdmx/microdata';
import {
  dataFileRequestArgsWrapper,
  rawDataRequestArgsWrapper,
} from '../lib/sdmx';
import { getDefaultCombinations } from '../lib/settings';
import { MICRODATA } from '../utils/constants';

const getState = R.prop('microdata');

export const getDimensionId = createSelector(getState, R.prop('dimensionId'));
export const getData = createSelector(getState, R.prop('data'));
export const getHasMicrodata = createSelector(
  getDimensionId,
  R.pipe(R.isNil, R.not),
);
export const getHasMicrodataData = createSelector(
  getData,
  R.pipe(R.isNil, R.not),
);
export const getIsMicrodata = createSelector(getViewer, R.equals(MICRODATA));
export const getRange = createSelector(getState, R.propOr({}, 'range'));

export const getDataquery = createSelector(
  getDimensionId,
  getDimensions,
  getMicrodataConstraints,
  getHierarchies,
  (dimensionId, dimensions, constraints, hierarchies) => {
    const parsedConstraints = R.pipe(
      R.toPairs,
      R.reduce((memo, [dimId, valId]) => {
        if (R.has(dimId, hierarchies)) {
          const descendants = getDescendantsFromHCL(
            valId,
            R.prop(dimId, hierarchies),
          );
          return R.assoc(dimId, descendants, memo);
        }
        return R.assoc(
          dimId,
          getDescendants(
            valId,
            R.pipe(R.find(R.propEq(dimId, 'id')), R.prop('values'))(dimensions),
          ),
          memo,
        );
      }, {}),
      R.assoc(dimensionId, ['DD']),
    )(constraints);
    const dataquery = getDataqueryMicrodata(dimensions, parsedConstraints);
    return dataquery;
  },
);

const getMicrodataRequestParams = createSelector(
  getDataRequestParams,
  getMicrodataConstraints,
  getTimePeriodArtefact,
  (defaultParams, constraints, timeArtefact) => {
    const timeConstraint = R.prop(R.prop('id', timeArtefact), constraints);

    if (R.isNil(timeConstraint)) {
      return defaultParams;
    }

    return { startPeriod: timeConstraint, endPeriod: timeConstraint };
  },
);

export const getRawMicrodataRequestArgs = createSelector(
  getRawStructureRequestArgs,
  getDataquery,
  getMicrodataRequestParams,
  getExternalReference,
  getDataRequestRange,
  rawDataRequestArgsWrapper,
);

export const getMicrodataRequestArgs = createSelector(
  getRawMicrodataRequestArgs,
  (args) => {
    /*
    We wish to separate microdata request headers customization from regular data request headers customization,
    (don't want to spread hybrid format for metadata avaibility)
    but microdata being a data request, sdmxjs will look for data entry in headers customization,
    so here microdata is plug into data
  */
    return R.pipe(
      getRequestArgs,
      R.assoc('datasourceId', R.path(['datasource', 'id'], args)),
    )({ ...args, type: 'data' });
  },
);

export const getMicrodataFileRequestArgs = (isFull) =>
  createSelector(
    getRawMicrodataRequestArgs,
    getDisplay,
    dataFileRequestArgsWrapper(isFull),
  );

export const getDataDimensions = createSelector(
  getData,
  R.pathOr([], ['structure', 'dimensions', 'observation']),
);

export const getDataAttributes = createSelector(
  getData,
  R.pathOr([], ['structure', 'attributes', 'observation']),
);

export const getRefinedDimensions = createSelector(
  getDataDimensions,
  getDataquery,
  (dimensions, dataquery) => rules2.refineDimensions(dimensions, dataquery),
);

export const getParsedAttributes = createSelector(
  getDataAttributes,
  getRefinedDimensions,
  getCustomAttributes,
  (attributes, dimensions, customAttributes) =>
    rules2.parseAttributes(attributes, dimensions, customAttributes),
);

export const getOneValueDimensions = createSelector(
  getRefinedDimensions,
  getParsedAttributes,
  (dimensions, attributes) =>
    rules2.getOneValueDimensions(dimensions, attributes),
);

export const getParsedCombinations = createSelector(
  getAnnotations,
  getLocale,
  getParsedAttributes,
  getRefinedDimensions,
  (annotations, locale, parsedAttributes, dimensions) => {
    const combinations = R.when(
      R.isEmpty,
      R.always(getDefaultCombinations(locale)),
      rules2.getCombinationDefinitions(annotations, locale),
    );
    return rules2.parseCombinations(combinations, parsedAttributes, dimensions);
  },
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

export const getDataflowAttributes = createSelector(
  getParsedAttributes,
  getParsedCombinations,
  (attributes, combinations) =>
    rules2.getDataflowAttributes(attributes, combinations),
);

export const getHeaderTitle = createSelector(
  getDataflow,
  getDataflowName,
  getDataflowAttributes,
  getDisplay,
  getCustomAttributes,
  (dataflow, name, attributes, display, customAttributes) =>
    rules2.getHeaderTitle(
      { id: dataflow.dataflowId, name },
      attributes,
      display,
      customAttributes,
    ),
);

export const getHeaderSubtitle = createSelector(
  getOneValueDimensions,
  getParsedCombinations,
  getCustomAttributes,
  getDisplay,
  getDimensionId,
  (dimensions, combinations, customAttributes, display, microdataDimension) =>
    rules2.getHeaderSubtitle(
      dimensions,
      combinations,
      customAttributes,
      display,
      microdataDimension,
    ),
);

export const getHeaderCombinations = createSelector(
  getParsedCombinations,
  getOneValueDimensions,
  getRefinedAttributes,
  getDisplay,
  (combinations, dimensions, attributes, display) =>
    rules2.getHeaderCombinations(combinations, dimensions, attributes, display),
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
