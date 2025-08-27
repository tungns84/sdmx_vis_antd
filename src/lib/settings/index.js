import * as R from 'ramda';
import dateFns from 'date-fns';
// import { getDateInTheRange, dateWithoutTZ } from '../../utils/date';
import { OVERVIEW, TABLE, CHART_IDS, MICRODATA } from '../../utils/constants';
import { dateWithoutTZ, getDateInTheRange } from '../../utils/date';

const viewerIds = {
  ...CHART_IDS,
  TABLE,
  OVERVIEW,
  MICRODATA,
};

export const app = R.propOr({}, 'app', window.SETTINGS);
export const title = R.propOr({}, 'title', app);
export const defaultViewer = R.pipe(
  R.propOr('', 'defaultView'),
  R.toUpper,
  R.flip(R.prop)(viewerIds),
  R.defaultTo(OVERVIEW),
)(app);
export const hasContactForm = R.pathOr(true, ['contact', 'form'], app);
export const hasContactCaptcha =
  R.pathOr(true, ['contact', 'captcha'], app) && window.CONFIG?.hasCaptcha;
export const i18n = R.propOr({}, 'i18n', window.SETTINGS);
export const search = R.propOr({}, 'search', window.SETTINGS);
export const theme = R.propOr({}, 'theme', window.SETTINGS);
export const sdmx = R.propOr({}, 'sdmx', window.SETTINGS);
export const viewer = R.propOr({}, 'viewer', window.SETTINGS);
export const analytics = R.propOr({}, 'analytics', window.SETTINGS);
export const contact = R.propOr({}, 'contact', window.SETTINGS);
export const sanitizeOptions = R.propOr(
  {},
  'htmlSanitization',
  window.SETTINGS,
);

export const chart = R.propOr({}, 'chart', window.SETTINGS);
export const chartIsVisible = R.propOr(true, 'isVisible', chart);

export const outerPalette = R.propOr({}, 'outerPalette', theme);

export const defaultSearchRows = R.prop('defaultRows', search);
export const homeFacetLevel2Clickable = R.prop(
  'homeFacetLevel2Clickable',
  search,
);
export const isHomeFacetCentered = R.prop('homeFacetCentered', search);
export const homeFacetIds = R.propOr([], 'homeFacetIds', search);
export const setOfHideHomeFacetItemIDs = new Set(
  R.propOr([], 'hideHomeFacetItemIDs', search),
);
export const setOfHideHomeAndResultFacetItemIDs = new Set(
  R.propOr([], 'hideHomeAndResultFacetItemIDs', search),
);
export const downloadableDataflowResults = R.propOr(
  false,
  'downloadableDataflowResults',
  search,
);
const selectedFacetIds = R.pipe(
  R.converge(R.intersection, [
    R.propOr([], 'homeFacetIds'),
    R.propOr([], 'expandedHomeFacets'),
  ]),
);
export const selectedFacetId = R.pipe(
  R.pluck('id'),
  R.intersection(selectedFacetIds(search)),
  R.head,
);
export const defaultFacetsNumber = R.propOr(6, 'defaultFacetsNumber')(search);
export const defaultRelatedDataflowsNumber = R.pipe(
  R.propOr({}, 'overview'),
  R.propOr(4, 'defaultRelatedDataflowsNumber'),
)(window.SETTINGS);

export const hasNoSearch = R.pipe(R.has('endpoint'), R.not)(search);

export const displayChildren = R.propOr(
  false,
  'spotlightDisplayChildren',
  search,
);

export const getLocalisedSettings = (id, locale = 'en', propName) => {
  const settings = R.propOr({}, propName, window.SETTINGS);
  const setting = R.prop(id, settings);
  if (!setting) return;
  if (R.is(String, setting)) return setting;
  return R.propOr('', locale, setting);
};

export const getAsset = (id, locale = 'en') =>
  getLocalisedSettings(id, locale, 'assets');
export const getApp = (id, locale = 'en') =>
  getLocalisedSettings(id, locale, 'app');

export const locales = R.propOr({}, 'locales', i18n);
export const getLocaleId = (id) =>
  R.has(id, locales) ? id : R.prop('localeId', i18n);

const scope = window.CONFIG?.member?.scope;
export const spaces = R.propOr({}, 'spaces', scope);
export const datasources = R.propOr({}, 'datasources', scope);
export const getDatasource = (id) =>
  R.defaultTo(R.prop(id, spaces), R.prop(id, datasources));
export const getDatasourceFromUrl = (url) =>
  R.find(R.propEq(url, 'url'), R.values(datasources));

export const getSpaceFromUrl = (url) =>
  R.find(R.propEq(url, 'url'), R.values(spaces));
export const getSpaceFromDatasourceId = (id) => {
  const datasource = R.prop(id, datasources);
  return getSpaceFromUrl(R.prop('url', datasource));
};
export const getSpace = (id) =>
  R.ifElse(
    R.has(id),
    R.prop(id),
    R.always(getSpaceFromDatasourceId(id)),
  )(spaces);

export const getDatasourceIds = (id) => {
  // we want datasource id(s) from an id
  // the id can be a datasource id or a space id
  // depending on coming from DE search or DLM eye
  if (R.has(id, datasources)) return [id];
  if (!R.has(id, spaces)) return [];
  return R.pipe(
    R.toPairs,
    R.filter(([, { id: spaceId }]) => spaceId === id),
    R.map(R.head),
  )(datasources);
};

export const defaultFrequency = R.prop('frequency', sdmx);
export const sdmxPeriodBoundaries = R.pipe(
  R.pathOr([], ['period', 'boundaries']),
  ([start, end]) => {
    const startDate =
      R.isNil(start) || R.isEmpty(start) ? Date.now() : new Date(start);
    const endDate = R.isNil(end) || R.isEmpty(end) ? Date.now() : new Date(end);
    return [dateFns.startOfYear(startDate), dateFns.endOfYear(endDate)];
  },
)(sdmx);
export const sdmxPeriod = R.pipe(
  R.pathOr([], ['period', 'default']),
  ([start, end]) => {
    const startDate = R.either(R.isNil, R.isEmpty)(start)
      ? undefined
      : dateWithoutTZ(new Date(start));
    const endDate = R.either(R.isNil, R.isEmpty)(end)
      ? undefined
      : dateWithoutTZ(new Date(end));
    return [startDate, endDate];
  },
  R.map(getDateInTheRange(sdmxPeriodBoundaries)),
)(sdmx);

export const isDefaultTimeDimensionInverted = R.equals(
  'desc',
  R.pathOr([], ['period', 'defaultSort'])(sdmx),
);

export const defaultLastNPeriods = R.pathOr(5, ['period', 'lastNPeriods'])(
  sdmx,
);

export const getSdmxAttribute = (id) =>
  R.pipe(
    R.pathOr([], ['attributes', id]),
    R.ifElse(R.is(Array), R.identity, R.flip(R.append)([])),
  )(sdmx);
export const valueIcons = R.prop('valueIcons', sdmx);

export const chartOptions = R.prop('options', chart);
export const chartUrl = R.prop('url', chart);

export const mapOptions = R.pipe(
  R.path(['chart', 'maps']),
  R.values,
  R.map(({ id, levels }) =>
    R.map(
      (level) => ({
        ...level,
        id: `${id}:${level.id}`,
        mapId: id,
        levelId: level.id,
      }),
      levels,
    ),
  ),
  R.unnest,
)(window.SETTINGS);
export const getMapName =
  ({ localeId }) =>
  ({ id, names }) =>
    R.propOr(id, localeId, names);

export const getMap = (mapId) =>
  R.path(['chart', 'maps', mapId], window.SETTINGS);

export const cellsLimit = R.pipe(
  R.path(['table', 'cellsLimit']),
  R.when((v) => !R.is(Number, v), R.always(3000)),
)(window.SETTINGS);

export const customAttributes = R.propOr({}, 'attributes', sdmx);

export const isSpaceExternal = R.pipe(
  getSpace,
  R.ifElse(R.isNil, R.always(true), R.propOr(false, 'isExternal')),
);

export const hasExternalAuth = R.pipe(
  getSpace,
  R.ifElse(R.isNil, R.always(true), R.propOr(false, 'hasExternalAuth')),
);

export const isAuthRequired = window.CONFIG?.member?.scope?.oidc?.required;

export const getContactMailTo = (key) => R.path(['mailTo', key], contact);

export const defaultCombinations = R.pathOr(
  {},
  ['sdmx', 'defaultCombinations'],
  window.SETTINGS,
);

export const getDefaultCombinations = (locale) => {
  const definition = defaultCombinations;

  if (R.isEmpty(definition)) {
    return [];
  }
  const { concepts, names } = definition;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return R.useWith(
    (titles, texts) =>
      R.addIndex(R.map)((title, index) => {
        const split = R.split(':', title);
        if (R.length(split !== 2)) {
          return null;
        }
        const [id, codes] = split;
        return {
          id,
          concepts: R.split(',', codes),
          name: R.has(locale, texts)
            ? R.pipe(R.prop(locale), R.nth(index), R.split(':'), R.last)(texts)
            : `[${id}]`,
        };
      }, titles),
    [R.split(';'), R.map(R.split(';'))],
  )(concepts, names);
};
