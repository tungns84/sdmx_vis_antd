import * as R from 'ramda';
import axios from 'axios';

const methods = {
  getMap: ({ requestArgs }) =>
    axios.get(requestArgs.mapPath).then((res) => res.data),
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
