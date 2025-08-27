import React from 'react';
import Home from './home';
import Results from './results';
import { getHasNoSearchParams } from '../../selectors/search';
import { useSelector } from 'react-redux';

const Search = () => {
  const hasNoSearchParams = useSelector(getHasNoSearchParams);

  if (hasNoSearchParams) return <Home />;
  return <Results />;
};

export default Search;
