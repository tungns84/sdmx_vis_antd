import * as R from 'ramda';
import axios from 'axios';
import { rules2 } from '@sis-cc/dotstatsuite-components';
import * as Sentry from '@sentry/react';

const axiosDefaults = {
  //transitional: { silentJSONParsing: false, forcedJSONParsing: false },
};

const _get = (type, { requestArgs = {}, signal }) => {
  const { url, headers, params, responseType } = requestArgs;
  const domain = new URL(url).hostname;
  const parent = Sentry.getActiveSpan();
  return Sentry.startSpan(
    {
      name: `GET ${url}`,
      op: 'http.client.extended',
      parentSpan: parent,
      attributes: { domain, 'sdmx.type': type },
    },
    (span) => {
      return axios
        .get(url, {
          ...axiosDefaults,
          responseType: R.isNil(responseType) ? 'json' : responseType,
          headers,
          params,
          signal,
        })
        .then((res) => {
          const cacheStatus = res.headers['cf-cache-status'];
          if (cacheStatus) span.setAttribute('cache', cacheStatus);
          span.setAttribute('status_code', res.status);
          return res;
        });
    },
  );
};

const _post = ({ requestArgs = {}, callback, signal }) => {
  const { url, headers, params, body } = requestArgs;
  return axios
    .post(url, body, {
      ...axiosDefaults,
      headers,
      params,
      body,
      mode: 'cors',
      signal,
    })
    .then((res) => {
      if (R.is(Function, callback)) {
        callback();
      }
      return res;
    });
};

const requestData = (
  type,
  { requestArgs = {}, tooLongRequestErrorCallback, signal },
) => {
  const { url, datasourceId } = requestArgs;
  const configSpaces = window.CONFIG?.member?.scope?.spaces;
  const { supportsPostLongRequests = false, hasCustomRangeHeader = true } =
    R.propOr({}, datasourceId, configSpaces);

  const _requestArgs = R.over(R.lensProp('headers'), (headers) => {
    const range = R.prop('x-range', headers);
    if (R.isNil(range) || hasCustomRangeHeader) {
      return headers;
    }
    return R.pipe(R.assoc('range', range), R.dissoc('x-range'))(headers);
  })(requestArgs);

  return _get(type, { requestArgs: _requestArgs, signal }).catch((error) => {
    let isLikelyCORS = false;
    if (error.response && error.response.status === 0) {
      // Likely a CORS rejection or preflight failure.
      isLikelyCORS = true;
    } else if (error.response) {
      if (error.response.status === 414) isLikelyCORS = true;
    } else if (error.request) {
      // No response received at all — likely a CORS/network issue
      isLikelyCORS = true;
    }

    if (supportsPostLongRequests && isLikelyCORS) {
      const parsed = R.split('/', url);
      const dataquery = R.last(parsed);
      const newUrl = R.pipe(
        R.dropLast(1),
        R.append('body'),
        R.join('/'),
      )(parsed);
      const body = new FormData();
      body.append('key', dataquery);
      return _post({
        requestArgs: { ..._requestArgs, body, url: newUrl },
        callback: tooLongRequestErrorCallback,
        signal,
      });
    }

    throw error;
  });
};

const getStructure =
  (type = 'dataflow') =>
  (args) =>
    _get(type, args).then(R.prop('data'));
const getAvailableConstraints = (args) =>
  requestData('available constraints', args).then(R.prop('data'));
const getData =
  (type = 'data') =>
  (args) => {
    return requestData(type, args).then(({ data, headers }) => {
      const isSdmx3 = R.startsWith(
        rules2.SDMX_3_0_JSON_DATA_FORMAT,
        args?.requestArgs?.headers?.Accept,
      );
      const dataFunctor = isSdmx3
        ? rules2.sdmx_3_0_DataFormatPatch
        : R.identity;
      return { data: dataFunctor(data), headers };
    });
  };
const getMetadata = (args) => _get('metadata', args);
const getDataFile = (args) => requestData('datafile', args);
const getHierarchicalCodelist = getStructure('hierarchical codelist');
const getHierarchicalCodelists = ({ requestsArgs = [] }) =>
  Promise.all(
    R.map(
      (requestArgs) => getHierarchicalCodelist({ requestArgs }),
      requestsArgs,
    ),
  );

const methods = {
  getStructure: getStructure(),
  getStructureExternalResources: getStructure('structure external resources'),
  getRelatedArtefacts: getStructure('related artefacts'),
  getHierarchicalCodelist,
  getDataflowExternalResources: getStructure('dataflow external resources'),
  getHierarchicalCodelists,
  getData: getData(),
  getMicrodata: getData('microdata'),
  getBlankData: getData('blankdata'),
  getAvailableConstraints,
  getMetadata,
  getDataFile,
};

const error = (method) => () => {
  throw new Error(`Unkown method: ${method}`);
};

const main = ({ method, ...rest }) => (methods[method] || error(method))(rest);
R.compose(
  R.forEach(([name, fn]) => (main[name] = fn)),
  R.toPairs,
)(methods);

export default main;
