import { getSelectedValuesWithPath } from '../used-filter';

describe('used-filter tests', () => {
  it('getSelectedValuesWithPath complete test', () => {
    const filters = [
      {
        id: 'test',
        values: [
          { id: 'W', parentId: undefined, hierarchicalId: 'W' },
          { id: 'OECD', parentId: 'W', hierarchicalId: 'W.OECD' },
          { id: 'FRA', parentId: 'W.OECD', hierarchicalId: 'W.OECD.FRA' },
          {
            id: 'GER',
            parentId: 'W.OECD',
            hierarchicalId: 'W.OECD.GER',
            isSelected: true,
          },
          { id: 'EA', parentId: 'W', hierarchicalId: 'W.EA' },
          {
            id: 'GER',
            parentId: 'W.EA',
            hierarchicalId: 'W.EA.GER',
            isSelected: true,
          },
          { id: 'FRA', parentId: 'W.EA', hierarchicalId: 'W.EA.FRA' },
          { id: 'A', parentId: 'W', hierarchicalId: 'W.A' },
          { id: 'A2', parentId: 'W.A', hierarchicalId: 'W.A.A2' },
          {
            id: 'USA',
            parentId: 'W.A.A2',
            hierarchicalId: 'W.A.A2.USA',
            isSelected: true,
          },
          {
            id: 'GER',
            parentId: undefined,
            hierarchicalId: undefined,
            isSelected: true,
          },
        ],
      },
    ];

    const expected = [
      {
        id: 'test',
        values: [
          [
            {
              id: 'GER',
              isSelected: true,
              hierarchicalId: 'W.OECD.GER',
              parentId: undefined,
              parents: [
                [
                  {
                    hierarchicalId: 'W',
                    id: 'W',
                    parentId: undefined,
                  },
                  {
                    hierarchicalId: 'W.OECD',
                    id: 'OECD',
                    parentId: 'W',
                  },
                  {
                    hierarchicalId: 'W.OECD.GER',
                    id: 'GER',
                    isSelected: true,
                    parentId: undefined,
                  },
                ],
                [
                  {
                    hierarchicalId: 'W',
                    id: 'W',
                    parentId: undefined,
                  },
                  { id: 'EA', parentId: 'W', hierarchicalId: 'W.EA' },
                  {
                    id: 'GER',
                    parentId: undefined,
                    hierarchicalId: 'W.OECD.GER',
                    isSelected: true,
                  },
                ],
              ],
            },
          ],
          [
            { id: 'W', parentId: undefined, hierarchicalId: 'W' },
            { id: 'A', parentId: 'W', hierarchicalId: 'W.A' },
            { id: 'A2', parentId: 'W.A', hierarchicalId: 'W.A.A2' },
            {
              id: 'USA',
              parentId: 'W.A.A2',
              hierarchicalId: 'W.A.A2.USA',
              isSelected: true,
            },
          ],
        ],
      },
    ];
    expect(getSelectedValuesWithPath(filters)).toEqual(expected);
  });
});
