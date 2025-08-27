import { useSelector, useDispatch } from 'react-redux';
import qs from 'qs';
import {
  getDataFileRequestArgs,
  getIsCsvFileLinkHandled,
  getIsDataUrlTooLong,
} from '../selectors/sdmx';
import useSdmxDownload from './useSdmxDownload';
import { getIsUserLogged } from '../selectors/app.js';
import {
  getIsMicrodata,
  getMicrodataFileRequestArgs,
} from '../selectors/microdata';
import { flushLog, LOG_ERROR_VIS_CSV_DL, pushLog } from '../ducks/app';
import { getDlErrorLog } from './utils.js';

const getCsvUrl = ({ url, params }) =>
  `${url}${qs.stringify(params, { addQueryPrefix: true })}`;

export default ({ isFull = false }) => {
  const dispatch = useDispatch();
  const isUserLogged = useSelector(getIsUserLogged);
  const isDataUrlTooLong = useSelector(getIsDataUrlTooLong);
  const isCsvLinkHandled = useSelector(getIsCsvFileLinkHandled);
  const isMicrodata = useSelector(getIsMicrodata);

  const dataFileRequestArgs = useSelector(getDataFileRequestArgs(isFull));
  const microdataFileRequestArgs = useSelector(
    getMicrodataFileRequestArgs(isFull),
  );

  const { filename, ...requestArgs } = isMicrodata
    ? microdataFileRequestArgs
    : dataFileRequestArgs;

  const method = isMicrodata ? 'getMicrodata' : 'getData';

  const ctx = { requestArgs, filename, method };
  // isEnabled is for UI, not react-query
  const isEnabled = !isMicrodata || !isFull;

  const directLink = {
    isEnabled: !isUserLogged && !isDataUrlTooLong && isCsvLinkHandled,
    url: getCsvUrl(requestArgs),
  };

  const beforeHook = () => {
    dispatch(flushLog(LOG_ERROR_VIS_CSV_DL));
  };

  const errorHandler = ({ error }) => {
    const log = getDlErrorLog(error);
    dispatch(pushLog({ type: LOG_ERROR_VIS_CSV_DL, log }));
  };

  const { download, isLoading } = useSdmxDownload(ctx, {
    beforeHook,
    errorHandler,
  });

  return {
    download,
    isLoading,
    isEnabled,
    directLink,
    filename,
  };
};
