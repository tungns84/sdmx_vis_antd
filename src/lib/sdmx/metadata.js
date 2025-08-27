import * as R from 'ramda';
import { rules } from '@sis-cc/dotstatsuite-components';

const DEFAULT_REJECTED = ['_L', '_T', '_Z'];

export const isMetadataSupported = (datasource) => !R.isNil(datasource?.urlv3);

const singleTimeSelection = (value) => `ge:${value}+le:${value}`;

export const getMetadataTimePeriodSelection = (coordinates, timeArtefact) => {
  if (R.isNil(timeArtefact)) {
    return {};
  }

  const periodSelection = R.has(timeArtefact.id, coordinates)
    ? singleTimeSelection(R.prop(timeArtefact.id, coordinates))
    : null;

  if (R.isNil(periodSelection)) {
    return {};
  }

  return { [`c[${timeArtefact.id}]`]: periodSelection };
};

export const getPartialDataquery = (
  indexedDimValIds,
  dimensions,
  timeArtefactId,
) => {
  return R.pipe(
    R.filter((d) => d.id !== timeArtefactId),
    R.map((dim) => {
      const values = dim.values;
      if (R.length(values) === 1) {
        return R.prop('id', R.head(values));
      }
      if (!R.has(dim.id, indexedDimValIds)) {
        return '*';
      }
      return R.propOr('*', dim.id, indexedDimValIds);
    }),
    R.join('.'),
  )(dimensions);
};

export const getMetadataRequestUrl = (datasource, identifiers, dataquery) => {
  let { agencyId, code, version } = identifiers;
  version = R.isEmpty(version) || R.isNil(version) ? '~' : version;
  return `${
    datasource?.urlv3
  }/data/dataflow/${agencyId}/${code}/${version}/${dataquery || ''}`;
};

export const getMetadataRequestParams = (periodSelection = {}) => ({
  ...periodSelection,
  attributes: 'msd',
  measures: 'none',
  dimensionAtObservation: 'AllDimensions',
});

export const getHeaderAdvancedAttributes = (
  attributes,
  dimensions,
  combinations,
  customAttributes,
) => {
  const indexedDimensions = R.indexBy(R.prop('id'), dimensions);
  const combinationsConcepts = R.pipe(
    R.pluck('concepts'),
    R.unnest,
  )(combinations);
  const rejectedIds = R.unnest([
    combinationsConcepts,
    customAttributes.notes,
    customAttributes.flags,
  ]);
  return R.reduce(
    (acc, attribute) => {
      if (
        !R.prop('header', attribute) ||
        R.includes(attribute.id, rejectedIds)
      ) {
        return acc;
      }
      const value = R.head(attribute.values);
      if (
        R.isNil(value) ||
        !R.propOr(true, 'display', value) ||
        R.includes(value.id, DEFAULT_REJECTED)
      ) {
        return acc;
      }
      let ids = [];
      const coordinates = R.reduce(
        (_acc, id) => {
          const dim = R.prop(id, indexedDimensions);
          const value = R.head(dim.values);
          ids = R.append(`${dim.id}=${value.id}`, ids);
          return R.assoc(dim.id, value.id, _acc);
        },
        {},
        attribute.relationship,
      );
      const key = R.join(':', ids);
      const attr = {
        ...R.pick(['id', 'name'], attribute),
        value: R.head(attribute.values),
      };
      return R.pipe(
        R.set(R.lensPath([key, 'attributes', attribute.id]), attr),
        R.set(R.lensPath([key, 'coordinates']), coordinates),
      )(acc);
    },
    {},
    attributes,
  );
};

export const getSeriesAdvancedAttributes = (
  attributesSeries,
  combinations,
  customAttributes,
) => {
  const combinationsConcepts = R.pipe(
    R.pluck('concepts'),
    R.unnest,
  )(combinations);
  const nonAdvancedIds = R.unnest([
    combinationsConcepts,
    customAttributes.notes || [],
    customAttributes.flags || [],
  ]);
  return R.reduce(
    (acc, serieKey) => {
      const serie = R.prop(serieKey, attributesSeries);
      const attributes = R.omit(nonAdvancedIds, serie);
      if (R.isEmpty(attributes)) {
        return acc;
      }
      const coordinates = R.pipe(
        R.values,
        R.find(R.complement(R.isNil)),
        R.prop('coordinates'),
      )(attributes);
      return R.assoc(serieKey, { attributes, coordinates }, acc);
    },
    {},
    R.keys(attributesSeries),
  );
};

const formatAdvancedAttributeValue = (display) => (attr) => ({
  id: attr.id,
  label: rules.dimensionValueDisplay(display)(attr),
  value: rules.dimensionValueDisplay(display)(attr.value),
});

const getSerieKey = (dimensions) => (coordinates) =>
  R.pipe(
    R.map((dim) => {
      if (!R.has(dim.id, coordinates)) {
        return '';
      }
      const index = R.findIndex(
        R.propEq(coordinates[dim.id], 'id'),
        dim.values,
      );
      return index;
    }),
    R.join(':'),
  )(dimensions);

export const serializeAdvancedAttributes = (attributes, display, dimensions) =>
  R.reduce(
    (acc, attr) => {
      const formattedAttribute = formatAdvancedAttributeValue(display)(attr);
      const key = getSerieKey(dimensions)(attr.coordinates);

      return R.over(
        R.lensProp(key),
        (attrs) => R.append(formattedAttribute, attrs || []),
        acc,
      );
    },
    {},
    attributes,
  );

const sortByCoordinates = (a, b, option = false) => {
  const splitACoord = a.splitCoord;
  const splitBCoord = b.splitCoord;
  const aWeight = R.pipe(R.reject(R.isEmpty), R.length)(splitACoord);
  const bWeight = R.pipe(R.reject(R.isEmpty), R.length)(splitBCoord);
  const dfWeight = !aWeight || !bWeight;

  if (aWeight !== bWeight) {
    if (option && dfWeight) {
      return aWeight - bWeight;
    }
    return bWeight - aWeight;
  }

  let ind = 0;
  while (splitACoord[ind] === splitBCoord[ind]) {
    ind++;
  }
  const _a = R.isEmpty(splitACoord[ind]) ? 0 : Number(splitACoord[ind]);
  const _b = R.isEmpty(splitBCoord[ind]) ? 0 : Number(splitBCoord[ind]);
  return _b - _a;
};

// options = { display, attributesLabel, isHeader }
export const getSidebarData = (
  attributesSeries,
  metadataSeries,
  dataflow,
  dimensions,
  options,
) => {
  const coordinates = R.uniq(
    R.concat(R.keys(attributesSeries), R.keys(metadataSeries)),
  );
  return R.pipe(
    R.reduce((acc, coordinate) => {
      const attributes = R.prop(coordinate, attributesSeries);
      const metadata = R.prop(coordinate, metadataSeries);
      const children = R.concat(
        R.isNil(attributes)
          ? []
          : [
              {
                id: `${coordinate}-attr`,
                label: options.attributesLabel,
                children: attributes,
              },
            ],
        R.isNil(metadata) ? [] : metadata,
      );
      if (R.isEmpty(children)) {
        return acc;
      }
      const splitCoord = R.split(':', coordinate);
      const { split, labels } = R.addIndex(R.reduce)(
        (acc, valIndex, dimIndex) => {
          if (R.isEmpty(valIndex)) {
            return { ...acc, split: R.append('', acc.split) };
          }
          const dim = R.nth(dimIndex, dimensions);
          const values = R.propOr([], 'values', dim || {});
          const value = R.nth(Number(valIndex), values);
          if (
            !value ||
            !R.propOr(true, 'display', dim) ||
            !R.propOr(true, 'display', value) ||
            R.includes(R.prop('id', value), DEFAULT_REJECTED)
          ) {
            return { ...acc, split: R.append('', acc.split) };
          }
          const dimLabel = rules.dimensionValueDisplay(options.display)(dim);
          const valLabel = rules.dimensionValueDisplay(options.display)(value);
          return {
            labels: R.append(`${dimLabel}: ${valLabel}`, acc.labels),
            split: R.append(valIndex, acc.split),
          };
        },
        { split: [], labels: [] },
        splitCoord,
      );
      const label = R.isEmpty(labels)
        ? rules.dimensionValueDisplay(options.display)(dataflow)
        : R.join(' ● ', labels);

      return R.append(
        {
          id: R.join(':', split),
          splitCoord: split,
          label,
          children: R.filter(R.identity, children),
        },
        acc,
      );
    }, []),
    (series) => {
      // after removed non displayed dim vals, some series might be duplicated
      const grouped = R.groupBy(R.prop('id'), series);
      return R.pipe(
        R.map((entries) => {
          if (R.length(entries) === 1) {
            return R.head(entries);
          }
          const head = R.head(entries);
          const children = R.pipe(R.pluck('children'), R.unnest)(entries);
          return R.assoc('children', children, head);
        }),
        R.values,
      )(grouped);
    },
    R.sort((a, b) => sortByCoordinates(a, b, options.isHeader)),
  )(coordinates);
};
