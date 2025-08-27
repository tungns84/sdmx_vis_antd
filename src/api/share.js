import * as R from 'ramda';
import axios from 'axios';

let globalConfig = {};

const endpoint = (path, config = globalConfig) => `${config.endpoint}${path}`;

const methods = {
  setConfig: (config) => (globalConfig = { ...globalConfig, ...config }),
  create: (body, config = globalConfig) =>
    axios.post(endpoint(`/charts`), { ...body, confirmUrl: config.confirmUrl }),
  get: ({ id }) => axios.get(endpoint(`/charts/${id}`)),
  list: ({ token }) => axios.get(endpoint(`/charts`), { params: { token } }),
  confirm: ({ token }) =>
    axios.get(endpoint(`/charts/confirm`), { params: { token } }),
  delete: ({ token, id = '' }) =>
    axios.delete(endpoint(`/charts/${id}`), { params: { token } }),
  getEmail: ({ body }) =>
    axios.post(endpoint(`/mail/${body.email}`), { ...body }),
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
