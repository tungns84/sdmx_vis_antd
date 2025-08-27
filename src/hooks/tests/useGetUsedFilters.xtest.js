import React from 'react';
import { renderHook } from '@testing-library/react';
import useGetUsedFilters from '../useGetUsedFilters';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import createRootReducer from '../../reducers';
import useSdmxStructure from '../useSdmxStructure';

vi.mock('../useSdmxStructure');

const wrapperFactory =
  (state) =>
  ({ children }) => {
    const store = createStore(createRootReducer({}), state);
    return <Provider store={store}>{children}</Provider>;
  };

describe('useGetUsedFilters tests', () => {
  beforeEach(() => {
    useSdmxStructure.mockReturnValue({ automatedSelections: {} });
  });

  it('no selection', () => {
    const state = {
      sdmx: {
        dimensions: [
          {
            id: 'LOCATION',
            label: 'Country',
            display: true,
            values: [
              { id: 'AUS', display: true, hasData: true },
              { id: 'AUT', display: true, hasData: true },
              { id: 'FRA', display: true, hasData: true },
            ],
          },
          {
            id: 'TRANSACT',
            label: 'Transaction',
            display: true,
            values: [
              {
                id: 'GDP',
                label: '1--Gross Domestic Product',
                display: true,
                hasData: true,
              },
              {
                id: 'B1_GA',
                label: 'Gross domestic product (output approach)',
                parentId: 'GDP',
                display: true,
                hasData: true,
              },
              {
                id: 'B1_GE',
                label: 'Gross domestic product (expenditure approach)',
                parentId: 'GDP',
                display: true,
                hasData: true,
              },
              {
                id: 'B11',
                label: 'External balance of goods',
                parentId: 'B1_GE',
                display: true,
                hasData: true,
              },
            ],
          },
          {
            id: 'MEASURE',
            label: 'Measure',
            display: true,
            values: [
              {
                id: 'C',
                label: 'Current Prices',
                display: true,
                hasData: true,
              },
              {
                id: 'V',
                label: 'Constant Prices, national base year',
                display: true,
                hasData: true,
              },
            ],
          },
        ],
      },
      router: {
        location: {
          state: { dataquery: '' },
        },
      },
    };

    const expected = [];

    const { result } = renderHook(() => useGetUsedFilters(), {
      wrapper: wrapperFactory(state),
    });
    expect(result.current).toEqual(expected);
  });
  it('simple hierarchy case', () => {
    const state = {
      sdmx: {
        dimensions: [
          {
            id: 'LOCATION',
            label: 'Country',
            display: true,
            values: [
              { id: 'AUS', display: true, hasData: true },
              { id: 'AUT', display: true, hasData: true },
              { id: 'FRA', display: true, hasData: true },
            ],
          },
          {
            id: 'TRANSACT',
            label: 'Transaction',
            display: true,
            values: [
              {
                id: 'GDP',
                label: '1--Gross Domestic Product',
                display: true,
                hasData: true,
              },
              {
                id: 'B1_GA',
                label: 'Gross domestic product (output approach)',
                parentId: 'GDP',
                display: true,
                hasData: true,
              },
              {
                id: 'B1_GE',
                label: 'Gross domestic product (expenditure approach)',
                parentId: 'GDP',
                display: true,
                hasData: true,
              },
              {
                id: 'B11',
                label: 'External balance of goods',
                parentId: 'B1_GE',
                display: true,
                hasData: true,
              },
            ],
          },
          {
            id: 'MEASURE',
            label: 'Measure',
            display: true,
            values: [
              {
                id: 'C',
                label: 'Current Prices',
                display: true,
                hasData: true,
              },
              {
                id: 'V',
                label: 'Constant Prices, national base year',
                display: true,
                hasData: true,
              },
            ],
          },
        ],
      },
      router: {
        location: {
          state: { dataquery: '.B1_GA+B11.' },
        },
      },
    };

    const expected = [
      {
        id: 'TRANSACT',
        label: 'Transaction',
        display: true,
        values: [
          [
            {
              id: 'B1_GA',
              isSelected: true,
              label: 'Gross domestic product (output approach)',
              parents: [
                [
                  {
                    id: 'GDP',
                    label: '1--Gross Domestic Product',
                    display: true,
                    hasData: true,
                  },
                  {
                    id: 'B1_GA',
                    label: 'Gross domestic product (output approach)',
                    isSelected: true,
                    parentId: 'GDP',
                    display: true,
                    hasData: true,
                  },
                ],
              ],
              parentId: 'GDP',
              display: true,
              hasData: true,
              deprecated: [],
              isNotRemovable: false,
            },
          ],
          [
            {
              id: 'B11',
              isSelected: true,
              label: 'External balance of goods',
              parents: [
                [
                  {
                    id: 'GDP',
                    label: '1--Gross Domestic Product',
                    display: true,
                    hasData: true,
                  },
                  {
                    id: 'B1_GE',
                    label: 'Gross domestic product (expenditure approach)',
                    parentId: 'GDP',
                    display: true,
                    hasData: true,
                  },
                  {
                    id: 'B11',
                    label: 'External balance of goods',
                    isSelected: true,
                    parentId: 'B1_GE',
                    display: true,
                    hasData: true,
                  },
                ],
              ],
              parentId: 'B1_GE',
              display: true,
              hasData: true,
              deprecated: [],
              isNotRemovable: false,
            },
          ],
        ],
      },
    ];

    const { result } = renderHook(() => useGetUsedFilters(), {
      wrapper: wrapperFactory(state),
    });
    expect(result.current).toEqual(expected);
  });
  it('multi hierarchy case', () => {
    const state = {
      sdmx: {
        dimensions: [
          {
            id: 'LOCATION',
            label: 'Country',
            display: true,
            values: [
              {
                id: 'DAC',
                label: 'DAC countries',
                display: true,
                hasData: true,
              },
              { id: 'AUS', label: 'Australia', display: true, hasData: true },
              {
                id: 'DGPC',
                label: 'Developping countries',
                display: true,
                hasData: true,
              },
              { id: 'F', label: 'Africa', display: true, hasData: true },
              {
                id: 'F3',
                label: 'Eastern Africa',
                display: true,
                hasData: true,
              },
              { id: 'ACP', label: 'ACP', display: true, hasData: true },
              { id: 'KEN', label: 'Kenya', display: true, hasData: true },
              { id: 'S', label: 'Asia', display: true, hasData: true },
              {
                id: 'S2_S8',
                label: 'Eastern and South-eastern Asia',
                display: true,
                hasData: true,
              },
              { id: 'KHM', label: 'Cambodia', display: true, hasData: true },
            ],
          },
          {
            id: 'TRANSACT',
            label: 'Transaction',
            display: true,
            values: [
              {
                id: 'GDP',
                label: '1--Gross Domestic Product',
                display: true,
                hasData: true,
              },
              {
                id: 'B1_GA',
                label: 'Gross domestic product (output approach)',
                parentId: 'GDP',
                display: true,
                hasData: true,
              },
              {
                id: 'B1_GE',
                label: 'Gross domestic product (expenditure approach)',
                parentId: 'GDP',
                display: true,
                hasData: true,
              },
              {
                id: 'B11',
                label: 'External balance of goods',
                parentId: 'B1_GE',
                display: true,
                hasData: true,
              },
            ],
          },
          {
            id: 'MEASURE',
            label: 'Measure',
            display: true,
            values: [
              {
                id: 'C',
                label: 'Current Prices',
                display: true,
                hasData: true,
              },
              {
                id: 'V',
                label: 'Constant Prices, national base year',
                display: true,
                hasData: true,
              },
            ],
          },
        ],
        hierarchies: {
          LOCATION: {
            '#ROOT': ['DAC', 'DGPC', 'ACP'],
            DAC: ['AUS'],
            DGPC: ['F', 'S'],
            'DGPC.F': ['F3'],
            'DGPC.F.F3': ['KEN'],
            'DGPC.S': ['S2_S8'],
            'DGPC.S.S2_S8': ['KHM'],
            ACP: ['KEN'],
          },
        },
      },
      router: {
        location: {
          state: { dataquery: 'AUS+KEN+KHM..' },
        },
      },
    };

    const expected = [
      {
        id: 'LOCATION',
        label: 'Country',
        display: true,
        values: [
          [
            {
              id: 'AUS',
              hierarchicalId: 'DAC.AUS',
              isSelected: true,
              label: 'Australia',
              parentId: 'DAC',
              parents: [
                [
                  {
                    id: 'DAC',
                    hierarchicalId: 'DAC',
                    label: 'DAC countries',
                    display: true,
                    hasData: true,
                    parentId: undefined,
                  },
                  {
                    id: 'AUS',
                    hierarchicalId: 'DAC.AUS',
                    label: 'Australia',
                    isSelected: true,
                    display: true,
                    hasData: true,
                    parentId: 'DAC',
                  },
                ],
              ],
              display: true,
              hasData: true,
              deprecated: [],
              isNotRemovable: false,
            },
          ],
          [
            {
              id: 'KEN',
              isSelected: true,
              hierarchicalId: 'DGPC.F.F3.KEN',
              label: 'Kenya',
              parentId: 'DGPC.F.F3',
              parents: [
                [
                  {
                    id: 'DGPC',
                    hierarchicalId: 'DGPC',
                    label: 'Developping countries',
                    display: true,
                    hasData: true,
                    parentId: undefined,
                  },
                  {
                    id: 'F',
                    hierarchicalId: 'DGPC.F',
                    label: 'Africa',
                    display: true,
                    hasData: true,
                    parentId: 'DGPC',
                  },
                  {
                    id: 'F3',
                    hierarchicalId: 'DGPC.F.F3',
                    label: 'Eastern Africa',
                    display: true,
                    hasData: true,
                    parentId: 'DGPC.F',
                  },
                  {
                    id: 'KEN',
                    isSelected: true,
                    hierarchicalId: 'DGPC.F.F3.KEN',
                    label: 'Kenya',
                    display: true,
                    hasData: true,
                    parentId: 'DGPC.F.F3',
                  },
                ],
                [
                  {
                    id: 'ACP',
                    hierarchicalId: 'ACP',
                    label: 'ACP',
                    display: true,
                    hasData: true,
                    parentId: undefined,
                  },
                  {
                    id: 'KEN',
                    isSelected: true,
                    hierarchicalId: 'ACP.KEN',
                    label: 'Kenya',
                    display: true,
                    hasData: true,
                    parentId: 'ACP',
                  },
                ],
              ],
              display: true,
              hasData: true,
              deprecated: [],
              isNotRemovable: false,
            },
          ],
          [
            {
              id: 'KHM',
              hierarchicalId: 'DGPC.S.S2_S8.KHM',
              isSelected: true,
              label: 'Cambodia',
              parentId: 'DGPC.S.S2_S8',
              parents: [
                [
                  {
                    id: 'DGPC',
                    hierarchicalId: 'DGPC',
                    label: 'Developping countries',
                    display: true,
                    hasData: true,
                    parentId: undefined,
                  },
                  {
                    id: 'S',
                    hierarchicalId: 'DGPC.S',
                    label: 'Asia',
                    display: true,
                    hasData: true,
                    parentId: 'DGPC',
                  },
                  {
                    id: 'S2_S8',
                    hierarchicalId: 'DGPC.S.S2_S8',
                    label: 'Eastern and South-eastern Asia',
                    display: true,
                    hasData: true,
                    parentId: 'DGPC.S',
                  },
                  {
                    id: 'KHM',
                    label: 'Cambodia',
                    hierarchicalId: 'DGPC.S.S2_S8.KHM',
                    isSelected: true,
                    display: true,
                    hasData: true,
                    parentId: 'DGPC.S.S2_S8',
                  },
                ],
              ],
              display: true,
              hasData: true,
              deprecated: [],
              isNotRemovable: false,
            },
          ],
        ],
      },
    ];

    const { result } = renderHook(() => useGetUsedFilters(), {
      wrapper: wrapperFactory(state),
    });
    expect(result.current).toEqual(expected);
  });
  it('deprecated and not removable', () => {
    const state = {
      sdmx: {
        dimensions: [
          {
            id: 'd0',
            display: true,
            values: [{ id: 'v0' }, { id: 'v1' }],
          },
          {
            id: 'REF_AREA',
            display: true,
            values: [
              { id: 'W', hasData: false, isForced: true },
              { id: 'A', hasData: false },
              { id: 'NA', hasData: false },
              { id: 'USA', hasData: true },
              { id: 'OECD', hasData: true },
              { id: 'FRA', hasData: true, isForced: true },
            ],
          },
        ],
        hierarchies: {
          REF_AREA: {
            '#ROOT': ['W'],
            W: ['A', 'OECD'],
            'W.A': ['NA'],
            'W.A.NA': ['USA'],
            'W.OECD': ['USA', 'FRA'],
          },
        },
      },
      router: {
        location: {
          state: { dataquery: '.W+NA+USA+OECD+FRA' },
        },
      },
    };

    const expected = [
      {
        id: 'REF_AREA',
        display: true,
        values: [
          [
            {
              id: 'W',
              hierarchicalId: 'W',
              isSelected: true,
              hasData: false,
              isForced: true,
              isNotRemovable: true,
              parents: null,
              deprecated: [],
              parentId: undefined,
            },
          ],
          [
            {
              id: 'OECD',
              hierarchicalId: 'W.OECD',
              isSelected: true,
              hasData: true,
              parentId: 'W',
              parents: [
                [
                  {
                    id: 'W',
                    hierarchicalId: 'W',
                    isSelected: true,
                    hasData: false,
                    isForced: true,
                    parentId: undefined,
                  },
                  {
                    id: 'OECD',
                    hierarchicalId: 'W.OECD',
                    isSelected: true,
                    hasData: true,
                    parentId: 'W',
                  },
                ],
              ],
              deprecated: [],
              isNotRemovable: false,
            },
          ],
          [
            {
              id: 'NA',
              hierarchicalId: 'W.A.NA',
              isSelected: true,
              hasData: false,
              parentId: 'W.A',
              isNotRemovable: false,
              parents: [
                [
                  {
                    id: 'W',
                    hierarchicalId: 'W',
                    isSelected: true,
                    hasData: false,
                    isForced: true,
                    parentId: undefined,
                  },
                  {
                    id: 'A',
                    hierarchicalId: 'W.A',
                    hasData: false,
                    parentId: 'W',
                  },
                  {
                    id: 'NA',
                    hierarchicalId: 'W.A.NA',
                    isSelected: true,
                    hasData: false,
                    parentId: 'W.A',
                  },
                ],
              ],
              deprecated: [],
            },
          ],
          [
            {
              id: 'USA',
              hierarchicalId: 'W.A.NA.USA',
              isSelected: true,
              hasData: true,
              parentId: 'W.A.NA',
              parents: [
                [
                  {
                    id: 'W',
                    hierarchicalId: 'W',
                    isSelected: true,
                    hasData: false,
                    isForced: true,
                    parentId: undefined,
                  },
                  {
                    id: 'A',
                    hierarchicalId: 'W.A',
                    hasData: false,
                    parentId: 'W',
                  },
                  {
                    id: 'NA',
                    hierarchicalId: 'W.A.NA',
                    isSelected: true,
                    hasData: false,
                    parentId: 'W.A',
                  },
                  {
                    id: 'USA',
                    hierarchicalId: 'W.A.NA.USA',
                    isSelected: true,
                    hasData: true,
                    parentId: 'W.A.NA',
                  },
                ],
                [
                  {
                    id: 'W',
                    hierarchicalId: 'W',
                    isSelected: true,
                    hasData: false,
                    isForced: true,
                    parentId: undefined,
                  },
                  {
                    id: 'OECD',
                    hierarchicalId: 'W.OECD',
                    isSelected: true,
                    hasData: true,
                    parentId: 'W',
                  },
                  {
                    id: 'USA',
                    hierarchicalId: 'W.OECD.USA',
                    isSelected: true,
                    hasData: true,
                    parentId: 'W.OECD',
                  },
                ],
              ],
              deprecated: ['NA'],
              isNotRemovable: false,
            },
          ],
          [
            {
              id: 'FRA',
              hierarchicalId: 'W.OECD.FRA',
              isSelected: true,
              hasData: true,
              parentId: 'W.OECD',
              isForced: true,
              isNotRemovable: false,
              deprecated: [],
              parents: [
                [
                  {
                    id: 'W',
                    hierarchicalId: 'W',
                    isSelected: true,
                    hasData: false,
                    isForced: true,
                    parentId: undefined,
                  },
                  {
                    id: 'OECD',
                    hierarchicalId: 'W.OECD',
                    isSelected: true,
                    hasData: true,
                    parentId: 'W',
                  },
                  {
                    id: 'FRA',
                    hierarchicalId: 'W.OECD.FRA',
                    isSelected: true,
                    hasData: true,
                    parentId: 'W.OECD',
                    isForced: true,
                  },
                ],
              ],
            },
          ],
        ],
      },
    ];

    const { result } = renderHook(() => useGetUsedFilters(), {
      wrapper: wrapperFactory(state),
    });
    expect(result.current).toEqual(expected);
  });
});
