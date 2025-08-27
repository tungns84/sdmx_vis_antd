import React from 'react';
import '@testing-library/jest-dom';
import Component from '../../../components/vis';
import { render } from '../mockProviders';

describe('vis component', () => {
  it('should render', () => {
    const { container } = render(<Component />);
    expect(container).toMatchSnapshot();
  });
});
