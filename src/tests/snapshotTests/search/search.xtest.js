import React from 'react';
import Search from '../../../components/search/index';
import { render } from '../mockProviders';
import '@testing-library/jest-dom';

describe('Search component', () => {
  it('should render', () => {
    const { container } = render(<Search />);
    expect(container).toMatchSnapshot();
  });
});
