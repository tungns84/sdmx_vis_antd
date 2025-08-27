import { createSelector } from 'reselect';
import * as R from 'ramda';
import { withIndex } from '../utils';
import {
  getLocale,
  getDataflow,
  getDisplay,
  getTimeDimensionOrders,
} from './router';
import { getData, getDataflowName } from './sdmx';
import { locales, getDatasource, customAttributes } from '../lib/settings';
import { rules, rules2 } from '@sis-cc/dotstatsuite-components';
import { DISPLAY_BOTH, DISPLAY_CODE, DISPLAY_LABEL } from '../utils/constants';

//-----------------------------------------------------------------------------------------------vis
const getVisState = R.prop('vis');
export const getVisActionId = () =>
  createSelector(getVisState, R.prop('actionId'));
export const getIsFull = () => createSelector(getVisState, R.prop('isFull'));
export const getIsOpeningFullscreen = createSelector(
  getVisState,
  R.prop('isOpeningFullscreen'),
);
export const getDataflowTitle = createSelector(getVisState, R.prop('title'));
export const getFilter = createSelector(getVisState, R.prop('filter'));
export const getShareLocale = () =>
  createSelector(getLocale, R.flip(R.prop)(locales));
export const getHasCsvDlStart = createSelector(
  getVisState,
  R.prop('hasCsvDlStart'),
);
export const getHasShared = createSelector(getVisState, R.prop('shared'));
export const getHasDownloadedExcel = createSelector(
  getVisState,
  R.pathEq('excel', ['excel', 'id']),
);
export const getHasDownloadedPng = createSelector(
  getVisState,
  R.pathEq('png', ['png', 'id']),
);

export const getVisDimensionFormat = (accessors) =>
  createSelector(getDisplay, (display) => {
    return R.prop(display, {
      [DISPLAY_LABEL]: rules.dimensionValueDisplay(DISPLAY_LABEL, accessors),
      [DISPLAY_CODE]: rules.dimensionValueDisplay(DISPLAY_CODE, accessors),
      [DISPLAY_BOTH]: rules.dimensionValueDisplay(DISPLAY_BOTH, accessors),
    });
  });

export const getDataDimensions = () =>
  createSelector(
    [getData],
    R.pipe(
      R.pathOr([], ['structure', 'dimensions', 'observation']),
      R.addIndex(R.map)((dimension, index) =>
        R.pipe(
          R.assoc('index', index),
          R.set(
            R.lensProp('values'),
            withIndex(R.propOr([], 'values')(dimension)),
          ),
        )(dimension),
      ),
    ),
  );
export const getVisDataDimensions = () =>
  createSelector(
    getDataDimensions(),
    R.pipe(
      R.partition(R.pipe(R.propOr([], 'values'), R.length, R.flip(R.gt)(1))),
      R.converge(
        (many, one) => ({
          many: R.indexBy(R.prop('id'))(many),
          one: R.indexBy(R.prop('id'))(one),
        }),
        [R.head, R.last],
      ),
    ),
  );

export const getEndpoint = (spaceId) =>
  createSelector([getDataflow], ({ datasourceId } = {}) => {
    if (R.and(R.isNil(spaceId), R.isNil(datasourceId)))
      throw new Error('No datasource');
    return getDatasource(spaceId ? spaceId : datasourceId).url;
  });
export const getReferencePartial = () =>
  createSelector(getDataflow, ({ datasourceId } = {}) => {
    if (R.isNil(datasourceId)) throw new Error('No datasource');
    const datasource = getDatasource(datasourceId);
    return R.propEq(true, 'supportsReferencePartial', datasource)
      ? '&detail=referencepartial'
      : '';
  });
export const getFormatedDataflowQuery = ({
  agencyId,
  code,
  version,
  joint,
  defaultVersion,
}) =>
  R.pipe(
    R.reject(R.isNil),
    R.join(joint),
  )([agencyId, code, R.defaultTo(defaultVersion, version)]);
export const getDataflowQuery = (
  joint = '/',
  defaultVersion = 'latest',
  sdmxId,
) =>
  createSelector(
    [getDataflow],
    ({ agencyId = '', code = '', version = '' } = {}) => {
      if (R.all(R.complement(R.isEmpty), [agencyId, code, version])) {
        return getFormatedDataflowQuery({
          agencyId,
          code,
          version,
          joint,
          defaultVersion,
        });
      }
      if (R.all(R.isNil, R.props(['agencyId', 'code', 'version'], sdmxId)))
        return undefined;
      return getFormatedDataflowQuery({ ...sdmxId, joint, defaultVersion });
    },
  );

export const getCustomAttributes = createSelector(getData, (data) => {
  const tooltipAttributesIds = rules2.getDataflowTooltipAttributesIds(
    { data },
    customAttributes,
  );
  return R.mergeRight(
    tooltipAttributesIds,
    R.pick(['prefscale', 'decimals', 'rejectedValueIds'], customAttributes),
  );
});

export const getIsTimeInverted = createSelector(
  getTimeDimensionOrders,
  R.pipe(R.values, R.head, R.equals(true)),
);

export const getAvailableCharts = createSelector(
  getData,
  rules.getAvailableChartTypes,
);

export const getVisDataflow = createSelector(
  getDataflow,
  getDataflowName,
  (dataflow, name) => ({
    id: dataflow.dataflowId,
    name,
  }),
);
