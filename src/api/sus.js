import * as R from 'ramda';
import axios from 'axios';

const methods = {
  createOne: ({ body, headers }) =>
    axios.post('/api/sus/createOne', body, { headers }).then((res) => res.data),
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
