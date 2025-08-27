import * as R from 'ramda';
import { useSelector } from 'react-redux';
import {
  getRequestArgs,
  getRequestHeaders,
  parseArtefactRelatives,
} from '@sis-cc/dotstatsuite-sdmxjs';
import { getLocale } from '../../selectors/router';
import { getDatasource } from '../../selectors/sdmx';
import useSdmxQuery from './useSdmxQuery';
import useSdmxStructure from '../useSdmxStructure';

const IN_CACHE_PROPS = ['relatedDataflows'];

const getCustomUrl = (datasource, customQuery) => {
  const separator = R.startsWith('/', customQuery) ? '' : '/';
  return `${R.prop('url', datasource)}${separator}${customQuery}`;
};

const getHasIdentifiers = (identifiers) => {
  if (R.isNil(identifiers) || R.isEmpty(identifiers)) return false;
  return R.pipe(R.values, R.none(R.isNil))(identifiers);
};

const isDataflow = R.propEq('dataflow', 'type');

const computeRequestArgs = ({
  hasIdentifiers,
  dsdIdentifiers,
  datasource,
  relatedData,
  locale,
}) => {
  if (!hasIdentifiers) return;
  if (R.isNil(relatedData)) {
    return getRequestArgs({
      identifiers: dsdIdentifiers,
      datasource,
      type: 'datastructure',
      withPartialReferences: false,
      params: {
        references: 'parents',
        detail: 'allcompletestubs',
      },
      locale,
    });
  }
  return {
    url: getCustomUrl(datasource, relatedData),
    // we're querying for structures
    // we need the correct header management provided by sdmxJs
    headers: getRequestHeaders({
      type: 'datastructure',
      locale,
      datasource,
    }),
  };
};

export default () => {
  const locale = useSelector(getLocale);
  const datasource = useSelector(getDatasource);
  const { relatedData, dsdIdentifiers, dataflowId, version, agencyId } =
    useSdmxStructure();

  const hasIdentifiers = getHasIdentifiers(dsdIdentifiers);
  const isEnabled = hasIdentifiers || !!relatedData;

  const requestArgs = computeRequestArgs({
    hasIdentifiers,
    dsdIdentifiers,
    datasource,
    relatedData,
    locale,
  });

  const ctx = { method: 'getRelatedArtefacts', requestArgs };

  const transformerHook = (relatedArtefacts) => {
    if (R.isNil(relatedArtefacts)) return [];

    const artefacts = parseArtefactRelatives({
      sdmxJson: relatedArtefacts,
      artefactId: `dataflow:${agencyId}:${dataflowId}(${version})`,
    });

    return {
      relatedDataflows: R.pipe(R.filter(isDataflow))(artefacts),
    };
  };

  const query = useSdmxQuery(ctx, {
    transformerHook,
    isEnabled,
  });

  return {
    // it's more user-friendly to expose direct RQ props (isLoading, isError, etc...)
    // without internals
    ...R.omit(['queryKey', 'isEnabled', 'data'], query),
    // only expose in cache props to avoid breaking single source of thruth principle
    // other props are stored in redux store for good or bad (refactoring needed) reasons
    ...R.pick(IN_CACHE_PROPS, R.propOr({}, 'data', query)),
  };
};
