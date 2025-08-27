import { getMultiHierarchicalFilters } from '../hierarchical-codelist';
import * as R from 'ramda';

describe('getMultiHierarchicalFilters tests', () => {
  it('simple test', () => {
    const hierarchies = {
      d0: {
        '#ROOT': ['OECD', 'EU'],
        EU: ['FRA', 'GER'],
        OECD: ['GER', 'JPN', 'FRA'],
      },
    };

    const dimensions = [
      {
        id: 'd0',
        values: [
          { id: 'OECD', order: 0 },
          { id: 'EU', order: 1 },
          { id: 'JPN', order: 2 },
          { id: 'FRA', order: 3 },
          { id: 'AUS', order: 4 },
          { id: 'AUT', order: 5 },
          { id: 'GER', order: 6 },
        ],
      },
      {
        id: 'd1',
        values: [{ id: 'v0' }, { id: 'v1' }, { id: 'v2' }],
      },
    ];

    const expected = [
      {
        id: 'd0',
        values: {
          '#ROOT': [
            { id: 'AUS', order: 4, parentId: undefined },
            { id: 'AUT', order: 5, parentId: undefined },
            {
              id: 'OECD',
              hierarchicalId: 'OECD',
              order: 0,
              parentId: undefined,
            },
            { id: 'EU', hierarchicalId: 'EU', order: 1, parentId: undefined },
          ],
          EU: [
            { id: 'FRA', order: 3, parentId: 'EU', hierarchicalId: 'EU.FRA' },
            { id: 'GER', order: 6, parentId: 'EU', hierarchicalId: 'EU.GER' },
          ],
          OECD: [
            {
              id: 'GER',
              order: 6,
              parentId: 'OECD',
              hierarchicalId: 'OECD.GER',
            },
            {
              id: 'JPN',
              order: 2,
              parentId: 'OECD',
              hierarchicalId: 'OECD.JPN',
            },
            {
              id: 'FRA',
              order: 3,
              parentId: 'OECD',
              hierarchicalId: 'OECD.FRA',
            },
          ],
        },
      },
      {
        id: 'd1',
        values: {
          '#ROOT': [{ id: 'v0' }, { id: 'v1' }, { id: 'v2' }],
        },
      },
    ];

    // flat results order cannot be insured
    const refineValues = R.over(
      R.lensProp('values'),
      R.reduce((acc, val) => {
        const parent = val.parentId || '#ROOT';
        const siblings = acc[parent] || [];
        return { ...acc, [parent]: R.append(val, siblings) };
      }, {}),
    );

    expect(
      R.pipe(getMultiHierarchicalFilters, R.map(refineValues))(
        dimensions,
        hierarchies,
      ),
    ).toEqual(expected);
  });
});
