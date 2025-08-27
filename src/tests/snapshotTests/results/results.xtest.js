import React from 'react';
import '@testing-library/jest-dom';
import Component from '../../../components/search/results';
import { render } from '../mockProviders';
import { ID_SEARCH_PAGE } from '../../../css-api';
import configureStore from '../../../configureStore';

vi.mock('../../../hooks/search/useSearchResults', () => ({
  isLoading: false,
  term: 'aaa',
  localeId: 'en',
  data: [],
  rows: [],
}));

describe('results component', () => {
  it('should render', () => {
    const { container } = render(<Component />);
    const element = container.querySelector(`#${ID_SEARCH_PAGE}`);
    expect(element).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
  it('should render with rtl', () => {
    const state = {
      router: {
        location: {
          locale: 'ar',
        },
      },
    };
    const store = configureStore(state);
    const { container } = render(<Component />, { store });
    expect(container).toMatchSnapshot();
  });
});
