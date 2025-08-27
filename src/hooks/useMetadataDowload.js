import { useSelector, useDispatch } from 'react-redux';
import qs from 'qs';
import * as R from 'ramda';
import { rules2 } from '@sis-cc/dotstatsuite-components';
import {
  getRawStructureRequestArgs,
  getTimePeriodArtefact,
  getIsCsvFileLinkHandled,
} from '../selectors/sdmx';
import { getIsUserLogged } from '../selectors/app.js';
import { getMSDIdentifiers, getCoordinates } from '../selectors/metadata';
import { getDisplay, getLocale } from '../selectors/router';
import { getDataDimensions } from '../selectors';
import {
  getMetadataRequestParams,
  getMetadataRequestUrl,
  getMetadataTimePeriodSelection,
  getPartialDataquery,
  isMetadataSupported,
} from '../lib/sdmx/metadata';
import { flushLog, LOG_ERROR_VIS_CSV_DL, pushLog } from '../ducks/app';
import useSdmxDownload from './useSdmxDownload';
import { getDlErrorLog } from './utils.js';

const getFilename = (dataquery, identifiers) => {
  const { agencyId, code, version = 'latest' } = identifiers;
  return `${agencyId}_${code}_${version}_${dataquery || 'all'}_metadata`;
};

const getCsvUrl = ({ url, params }) =>
  `${url}${qs.stringify(params, { addQueryPrefix: true })}`;

export default ({ isFull = false }) => {
  const dispatch = useDispatch();
  const isUserLogged = useSelector(getIsUserLogged);
  const isCsvLinkHandled = useSelector(getIsCsvFileLinkHandled);
  const { datasource, identifiers } = useSelector(getRawStructureRequestArgs);
  const msdIdentifiers = useSelector(getMSDIdentifiers);
  const locale = useSelector(getLocale);
  const display = useSelector(getDisplay);
  const timePeriodArtefact = useSelector(getTimePeriodArtefact);
  const dimensions = useSelector(getDataDimensions());
  const selectedCoordinates = useSelector(getCoordinates);

  const isMsdReferenced = !R.isNil(msdIdentifiers);
  // isEnabled is for UI, not react-query
  const isEnabled = isMetadataSupported(datasource) && isMsdReferenced;
  const periodSelection = getMetadataTimePeriodSelection(
    selectedCoordinates,
    timePeriodArtefact,
  );
  const dataquery = getPartialDataquery(
    selectedCoordinates,
    dimensions,
    R.prop('id', timePeriodArtefact),
  );
  const filename = getFilename(isFull ? null : dataquery, identifiers);
  const requestArgs = {
    headers: {
      ...(isFull ? {} : { 'x-level': 'upperOnly' }),
      Accept: R.pathOr(
        rules2.SDMX_3_0_CSV_DATA_FORMAT,
        ['headersv3', 'metadata', 'csv'],
        datasource,
      ),
      'accept-language': locale,
    },
    url: getMetadataRequestUrl(
      datasource,
      identifiers,
      isFull ? null : dataquery,
    ),
    params: R.pipe(
      getMetadataRequestParams,
      R.assoc('format', display === 'code' ? 'csvfile' : 'csvfilewithlabels'),
    )(isFull ? {} : periodSelection),
  };

  const ctx = { requestArgs, filename, method: 'getMetadata' };

  const directLink = {
    isEnabled: !isUserLogged && isCsvLinkHandled,
    url: getCsvUrl(requestArgs),
  };

  const beforeHook = () => {
    dispatch(flushLog(LOG_ERROR_VIS_CSV_DL));
  };

  const errorHandler = ({ error }) => {
    const log = getDlErrorLog(error);
    if (isFull) {
      dispatch(pushLog({ type: LOG_ERROR_VIS_CSV_DL, log }));
    }
  };

  const { download, isLoading, error } = useSdmxDownload(ctx, {
    beforeHook,
    errorHandler,
  });

  return {
    error,
    download,
    isLoading,
    isEnabled,
    directLink,
    filename,
  };
};
