import * as R from 'ramda';
import axios from 'axios';
import { configParser, searchParser } from '../lib/search';
import { datasources } from '../lib/settings';

let globalConfig = {};

const setConfig = (config) => (globalConfig = { ...globalConfig, ...config });

const endpoint = (path, config = globalConfig) => {
  if (R.isNil(config.endpoint)) return;
  return `${config.endpoint}${path}`;
};

const _get =
  (path, parser) =>
  ({ requestArgs, parserArgs }) => {
    const url = endpoint(path);
    if (R.isNil(url)) throw new Error('Search endpoint missing');

    const tenant = window?.CONFIG?.member?.id;
    if (R.isNil(tenant)) throw new Error('Tenant missing');
    if (R.isEmpty(datasources))
      throw new Error('Datasource(s) missing in the scope');

    const prepareRequestArgs = R.over(
      R.lensPath(['facets', 'datasourceId']),
      R.ifElse(
        R.either(R.isNil, R.isEmpty),
        R.always(R.keys(datasources)),
        R.identity,
      ),
    );

    return axios
      .post(url, prepareRequestArgs(requestArgs), { params: { tenant } })
      .then(R.pipe(R.prop('data'), parser(parserArgs)));
  };

const getConfig = _get('/search', configParser);
const getSearch = _get('/search', searchParser);

const getIsIndexedDataflows = ({ requestsArgs = [] }) =>
  Promise.all(R.map((requestArgs) => getSearch({ requestArgs }), requestsArgs));

const methods = {
  setConfig,
  getConfig,
  getSearch,
  getIsIndexedDataflows,
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
