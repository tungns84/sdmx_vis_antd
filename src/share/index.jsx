import React, { useReducer } from 'react';
import qs from 'qs';
import App from './components/App';
import reducer, { model } from './reducer';

const Share = () => {
  const params = qs.parse(window.location.search, { ignoreQueryPrefix: true });
  const [state, dispatch] = useReducer(reducer, model());
  return <App params={params} state={state} dispatch={dispatch} />;
};

export default Share;
