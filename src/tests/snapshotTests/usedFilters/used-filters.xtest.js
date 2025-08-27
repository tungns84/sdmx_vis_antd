import React from 'react';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Component from '../../../components/UsedFilters';
import { render } from '../mockProviders';
import * as R from 'ramda';

vi.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  useMediaQuery: vi.fn().mockReturnValue(false),
}));

describe('applied filters component', () => {
  it('should render', () => {
    const props = {
      maxWidth: 250,
      counter: 10,
      data: [
        {
          items: [
            {
              id: 'TIME_PERIOD',
              label: 'Time period',
              values: [
                [{ id: 'start', label: 'Start: 2018.07.28' }],
                [{ id: 'end', label: 'End: 2018.07.28' }],
                [{ id: 'lastn', label: 'Last 1 period(s)' }],
              ],
            },
            {
              id: 'FREQUENCY',
              label: 'Frequency',
              isNotRemovable: true,
              values: [[{ id: 'start', label: 'Daily', isNotRemovable: true }]],
            },
          ],
          onDelete: vi.fn(),
          labelRenderer: R.prop('label'),
        },
      ],
      labels: {},
      onDeleteAll: vi.fn(),
      clearAllLabel: 'Clear All Filters',
      dataCount: 25,
      dataCountLabel: 'label',
    };
    const { container } = render(<Component {...props} />);
    const element = screen.queryByTestId('usedFilters-vis-test-id');
    const deleteChip = screen.queryAllByTestId('deleteChip-test-id');
    const chips = screen.queryAllByTestId('chips-test-id');
    expect(chips.length).toEqual(2);
    expect(element).toBeDefined();
    expect(deleteChip).toBeDefined();
    expect(container).toContainElement(element);
    expect(container).toMatchSnapshot();
  });
  it('should render in small screen', () => {
    const props = {
      maxWidth: 250,
      counter: 10,
      data: [],
      labels: {},
      onDeleteAll: vi.fn(),
      clearAllLabel: 'Clear All Filters',
      dataCount: 25,
      dataCountLabel: 'label',
    };
    const theme = {
      breakpoints: {
        xs: 120,
        xs2: 250,
        xs3: 270,
        sm: 370,
        md: 420,
        md2: 560,
        lg: 760,
        xl: 855,
        down: (key) => `(max-width:${theme.breakpoints[key]}px)`,
      },
    };

    jest.spyOn(theme.breakpoints, 'down').mockReturnValue(true);
    const { container } = render(<Component {...props} />);
    expect(container).toMatchSnapshot();
  });
});
