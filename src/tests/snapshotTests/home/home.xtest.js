import React from 'react';
import Home from '../../../components/search/home';
import { render } from '../mockProviders';
import { ID_HOME_PAGE } from '../../../css-api';
import '@testing-library/jest-dom';

describe('Search component', () => {
  it('should render', () => {
    const { container } = render(<Home />);
    const element = container.querySelector(`#${ID_HOME_PAGE}`);
    expect(element).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
  it('should render results page', () => {
    const initialState = {
      router: { state: { term: 'toto', constraints: {} } },
    };
    const { container } = render(<Home />, { initialState });
    expect(container).toMatchSnapshot();
  });
});
