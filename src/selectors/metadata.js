import { createSelector } from 'reselect';
import * as R from 'ramda';
import { getRequestArgs } from '@sis-cc/dotstatsuite-sdmxjs';
//import { rules } from '@sis-cc/dotstatsuite-components';
import { getDataflow, getDisplay, getLocale } from './router';
import { getData } from './sdmx';
import { getDataDimensions } from './';
import { getDatasource } from '../lib/settings';
import {
  getAdvancedAttributes,
  getMetadataCoordinates,
  getHeaderCoordinates,
} from './data';
import { serializeAdvancedAttributes } from '../lib/sdmx/metadata';

const getState = R.prop('metadata');

export const getIsOpen = createSelector(getState, R.prop('isOpen'));

export const getCoordinates = createSelector(getState, R.prop('coordinates'));

export const getCellAttributes = createSelector(
  getState,
  R.prop('cellAttributes'),
);

export const getMSDIdentifiers = createSelector(getData, (data) => {
  const msdDefinition = R.pipe(
    R.pathOr([], ['structure', 'annotations']),
    R.find(({ type = '' }) => R.toLower(type) === 'metadata'),
    R.prop('title'),
  )(data);
  if (R.isNil(msdDefinition)) {
    return null;
  }
  const match = msdDefinition.match(/=([\w@_.]+):([\w@_.]+)\(([\d.]+)\)$/);
  if (R.isNil(match)) {
    return null;
  }
  const [agencyId, code, version] = R.tail(match);
  return { agencyId, code, version };
});

export const getMSDRequestArgs = createSelector(
  getDataflow,
  getLocale,
  getMSDIdentifiers,
  (dataflow, locale, identifiers) =>
    R.pipe(
      getRequestArgs,
      R.evolve({
        url: R.flip(R.concat)('/?references=conceptscheme'),
      }),
    )({
      datasource: getDatasource(R.prop('datasourceId', dataflow)),
      identifiers: identifiers || {},
      locale,
      type: 'metadatastructure',
      withReferences: false,
    }),
);

export const getHeaderSideProps = createSelector(
  getAdvancedAttributes,
  getMetadataCoordinates,
  getHeaderCoordinates,
  (advancedAttributes, metadataCoordinates, headerCoordinates) => {
    const hasAdvancedAttributes = R.pipe(
      R.values,
      R.find((serie) => {
        const mergedCoord = R.mergeLeft(serie.coordinates, headerCoordinates);
        return R.equals(mergedCoord, headerCoordinates);
      }),
      R.complement(R.isNil),
    )(advancedAttributes || {});
    const hasMetadata = R.pipe(
      R.find((coordinates) => {
        const mergedCoord = R.mergeLeft(coordinates, headerCoordinates);
        return R.equals(mergedCoord, headerCoordinates);
      }),
      R.complement(R.isNil),
    )(metadataCoordinates || []);
    return hasMetadata || hasAdvancedAttributes
      ? {
          coordinates: headerCoordinates,
          hasMetadata,
          hasAdvancedAttributes,
        }
      : null;
  },
);

export const getRefinedCellAttributes = createSelector(
  getCellAttributes,
  getDisplay,
  getDataDimensions(),
  (cellAttributes, display, dimensions) =>
    serializeAdvancedAttributes(
      R.values(cellAttributes || {}),
      display,
      dimensions,
    ),
);

export const getAttributesSeries = createSelector(
  getCoordinates,
  getAdvancedAttributes,
  getRefinedCellAttributes,
  getDisplay,
  getDataDimensions(),
  (coordinates, advancedAttributes, cellAttributes, display, dimensions) => {
    if (!R.isEmpty(cellAttributes)) {
      return cellAttributes;
    }
    return R.pipe(
      R.filter((serie) => {
        const mergedCoord = R.mergeLeft(serie.coordinates, coordinates);
        return R.equals(mergedCoord, coordinates);
      }),
      (series) =>
        serializeAdvancedAttributes(
          R.pipe(R.values, R.pluck('attributes'), R.mergeAll, R.values)(series),
          display,
          dimensions,
        ),
    )(advancedAttributes);
  },
);
