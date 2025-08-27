import {
  getDescendants,
  getDrilldownCodelists,
  extractArtefactValues,
  getMissingRows,
  getDescendantsFromHCL,
} from '../microdata';

describe('Microdata (sdmx lib)', () => {
  it('should getDescendants', () => {
    expect(getDescendants()).toEqual([]);
    expect(
      getDescendants(100, [
        { id: 100 },
        { id: 200 },
        { id: 'A', parentId: 100 },
        { id: 'B', parentId: 100 },
        { id: 'C', parentId: 200 },
        { id: 'X', parentId: 'A' },
      ]),
    ).toEqual(['100', 'A', 'B', 'X']);
    expect(
      getDescendants(100, [
        { id: 200 },
        { id: 'B', parentId: 100 },
        { id: 'X', parentId: 'A' },
        { id: 100 },
        { id: 'A', parentId: 100 },
        { id: 'C', parentId: 200 },
      ]),
    ).toEqual(['100', 'B', 'A', 'X']);
    expect(
      getDescendants(100, [
        { id: 200 },
        { id: 'B', parentId: 1000 },
        { id: 'X', parentId: 'A' },
        { id: 100 },
        { id: 'A', parentId: 1000 },
        { id: 'C', parentId: 200 },
      ]),
    ).toEqual(['100']); // 2 recursive calls when no descendant
  });
});

describe('microdata getDrilldownCodelists tests', () => {
  it('all codelists, no hierarchies', () => {
    const data = {
      structure: {
        annotations: [],
        dimensions: {
          observation: [
            {
              id: 'dim1',
              name: 'dimension 1',
              values: [
                { id: 'v0', __indexPosition: 2 },
                { id: 'v1', __indexPosition: 0 },
                { id: 'v2', __indexPosition: 1 },
              ],
            },
            {
              id: 'dim2',
              name: 'dimension 2',
              values: [
                { id: 'v0', __indexPosition: 1 },
                { id: 'v1', __indexPosition: 2 },
                { id: 'v2', __indexPosition: 0 },
              ],
            },
          ],
        },
        attributes: {
          observation: [
            {
              id: 'attr1',
              name: 'attribute 1',
              values: [{ id: 'v0', __indexPosition: 0 }],
            },
            {
              id: 'attr2',
              name: 'attribute 2',
              values: [
                { id: 'v0', __indexPosition: 0 },
                { id: 'v1', __indexPosition: 1 },
                { id: 'v2', __indexPosition: 2 },
              ],
            },
          ],
        },
      },
    };

    const expected = [
      {
        id: 'dim1',
        name: 'dimension 1',
        isDimension: true,
        values: [
          {
            id: 'v1',
            __indexPosition: 0,
            parent: undefined,
            parents: [],
            isSelected: true,
          },
          {
            id: 'v2',
            __indexPosition: 1,
            parent: undefined,
            parents: [],
            isSelected: true,
          },
          {
            id: 'v0',
            __indexPosition: 2,
            parent: undefined,
            parents: [],
            isSelected: true,
          },
        ],
      },
      {
        id: 'dim2',
        name: 'dimension 2',
        isDimension: true,
        values: [
          {
            id: 'v2',
            __indexPosition: 0,
            parent: undefined,
            parents: [],
            isSelected: true,
          },
          {
            id: 'v0',
            __indexPosition: 1,
            parent: undefined,
            parents: [],
            isSelected: true,
          },
          {
            id: 'v1',
            __indexPosition: 2,
            parent: undefined,
            parents: [],
            isSelected: true,
          },
        ],
      },
      {
        id: 'attr1',
        name: 'attribute 1',
        isAttribute: true,
        values: [{ id: 'v0', __indexPosition: 0, isSelected: true }],
      },
      {
        id: 'attr2',
        name: 'attribute 2',
        isAttribute: true,
        values: [
          {
            id: 'v0',
            __indexPosition: 0,
            parent: undefined,
            parents: [],
            isSelected: true,
          },
          {
            id: 'v1',
            __indexPosition: 1,
            parent: undefined,
            parents: [],
            isSelected: true,
          },
          {
            id: 'v2',
            __indexPosition: 2,
            parent: undefined,
            parents: [],
            isSelected: true,
          },
        ],
      },
    ];

    expect(getDrilldownCodelists(data, {}, {})).toEqual(expected);
  });
  it('codelists defined by annotations, no hierarchies', () => {
    const data = {
      dataSets: [
        {
          annotations: [0, 1, 2],
        },
      ],
      structure: {
        annotations: [
          { type: 'test' },
          { type: 'DRILLDOWN_CONCEPTS', title: 'dim1' },
          { type: 'DRILLDOWN_CONCEPTS', title: 'attr1,attr2' },
        ],
        dimensions: {
          observation: [
            {
              id: 'dim1',
              name: 'dimension 1',
              values: [
                { id: 'v0', __indexPosition: 2 },
                { id: 'v1', __indexPosition: 0 },
                { id: 'v2', __indexPosition: 1 },
              ],
            },
            {
              id: 'dim2',
              name: 'dimension 2',
              values: [
                { id: 'v0', __indexPosition: 1 },
                { id: 'v1', __indexPosition: 2 },
                { id: 'v2', __indexPosition: 0 },
              ],
            },
          ],
        },
        attributes: {
          observation: [
            {
              id: 'attr1',
              name: 'attribute 1',
              values: [{ id: 'v0', __indexPosition: 0 }],
            },
            {
              id: 'attr2',
              name: 'attribute 2',
              values: [
                { id: 'v0', __indexPosition: 0 },
                { id: 'v1', __indexPosition: 1 },
                { id: 'v2', __indexPosition: 2 },
              ],
            },
          ],
        },
      },
    };

    const expected = [
      {
        id: 'dim1',
        name: 'dimension 1',
        isDimension: true,
        values: [
          {
            id: 'v1',
            __indexPosition: 0,
            parent: undefined,
            parents: [],
            isSelected: true,
          },
          {
            id: 'v2',
            __indexPosition: 1,
            parent: undefined,
            parents: [],
            isSelected: true,
          },
          {
            id: 'v0',
            __indexPosition: 2,
            parent: undefined,
            parents: [],
            isSelected: true,
          },
        ],
      },
      {
        id: 'attr1',
        name: 'attribute 1',
        isAttribute: true,
        values: [{ id: 'v0', __indexPosition: 0, isSelected: true }],
      },
      {
        id: 'attr2',
        name: 'attribute 2',
        isAttribute: true,
        values: [
          {
            id: 'v0',
            __indexPosition: 0,
            parent: undefined,
            parents: [],
            isSelected: true,
          },
          {
            id: 'v1',
            __indexPosition: 1,
            parent: undefined,
            parents: [],
            isSelected: true,
          },
          {
            id: 'v2',
            __indexPosition: 2,
            parent: undefined,
            parents: [],
            isSelected: true,
          },
        ],
      },
    ];

    expect(getDrilldownCodelists(data, {}, {})).toEqual(expected);
  });
  it('codelists defined by annotations, with hierarchies', () => {
    const data = {
      dataSets: [
        {
          annotations: [0, 1, 2],
        },
      ],
      structure: {
        annotations: [
          { type: 'test' },
          { type: 'DRILLDOWN_CONCEPTS', title: 'dim1' },
          { type: 'DRILLDOWN_CONCEPTS', title: 'attr1,attr2' },
        ],
        dimensions: {
          observation: [
            {
              id: 'dim1',
              name: 'dimension 1',
              values: [
                { id: 'W', __indexPosition: 0, isSelected: true },
                { id: 'EU', __indexPosition: 1, isSelected: true },
                { id: 'A', __indexPosition: 2, isSelected: true },
                { id: 'OECD', __indexPosition: 3, isSelected: true },
                { id: 'FRA', __indexPosition: 4, isSelected: true },
                { id: 'GER', __indexPosition: 5, isSelected: true },
                { id: 'USA', __indexPosition: 6, isSelected: true },
              ],
            },
            {
              id: 'dim2',
              name: 'dimension 2',
              values: [
                { id: 'v0', __indexPosition: 1 },
                { id: 'v1', __indexPosition: 2 },
                { id: 'v2', __indexPosition: 0 },
              ],
            },
          ],
        },
        attributes: {
          observation: [
            {
              id: 'attr1',
              name: 'attribute 1',
              values: [{ id: 'v0', __indexPosition: 0 }],
            },
            {
              id: 'attr2',
              name: 'attribute 2',
              values: [
                { id: 'PARENT', __indexPosition: 0 },
                { id: 'CHILD', __indexPosition: 1, parent: 'PARENT' },
                { id: 'GRANDCHILD', __indexPosition: 2, parent: 'CHILD' },
                { id: 'UNRELATED', __indexPosition: 3 },
              ],
            },
          ],
        },
      },
    };

    const hierarchies = {
      dim1: [
        {
          codeID: 'W',
          hierarchicalCodes: [
            {
              codeID: 'OECD',
              hierarchicalCodes: [
                { codeID: 'USA' },
                { codeID: 'FRA' },
                { codeID: 'GER' },
              ],
            },
            {
              codeID: 'EU',
              hierarchicalCodes: [{ codeID: 'GER' }, { codeID: 'FRA' }],
            },
            { codeID: 'A', hierarchicalCodes: [{ codeID: 'USA' }] },
          ],
        },
      ],
    };

    const expected = [
      {
        id: 'dim1',
        name: 'dimension 1',
        isDimension: true,
        values: [
          {
            id: 'W',
            __indexPosition: 0,
            parent: undefined,
            parents: [],
            isSelected: true,
          },
          {
            id: 'OECD',
            __indexPosition: 1,
            parent: 'W',
            parents: [0],
            isSelected: true,
          },
          {
            id: 'USA',
            __indexPosition: 2,
            parent: 'W.OECD',
            parents: [0, 1],
            isSelected: true,
          },
          {
            id: 'FRA',
            __indexPosition: 3,
            parent: 'W.OECD',
            parents: [0, 1],
            isSelected: true,
          },
          {
            id: 'GER',
            __indexPosition: 4,
            parent: 'W.OECD',
            parents: [0, 1],
            isSelected: true,
          },
          {
            id: 'EU',
            __indexPosition: 5,
            parent: 'W',
            parents: [0],
            isSelected: true,
          },
          {
            id: 'GER',
            __indexPosition: 6,
            parent: 'W.EU',
            parents: [0, 5],
            isSelected: true,
          },
          {
            id: 'FRA',
            __indexPosition: 7,
            parent: 'W.EU',
            parents: [0, 5],
            isSelected: true,
          },
          {
            id: 'A',
            __indexPosition: 8,
            parent: 'W',
            parents: [0],
            isSelected: true,
          },
          {
            id: 'USA',
            __indexPosition: 9,
            parent: 'W.A',
            parents: [0, 8],
            isSelected: true,
          },
        ],
      },
      {
        id: 'attr1',
        name: 'attribute 1',
        isAttribute: true,
        values: [{ id: 'v0', __indexPosition: 0, isSelected: true }],
      },
      {
        id: 'attr2',
        name: 'attribute 2',
        isAttribute: true,
        values: [
          {
            id: 'PARENT',
            __indexPosition: 0,
            parent: undefined,
            parents: [],
            isSelected: true,
          },
          {
            id: 'CHILD',
            __indexPosition: 1,
            parent: 'PARENT',
            parents: [0],
            isSelected: true,
          },
          {
            id: 'GRANDCHILD',
            __indexPosition: 2,
            parent: 'CHILD',
            parents: [0, 1],
            isSelected: true,
          },
          {
            id: 'UNRELATED',
            __indexPosition: 3,
            parent: undefined,
            parents: [],
            isSelected: true,
          },
        ],
      },
    ];

    expect(getDrilldownCodelists(data, hierarchies)).toEqual(expected);
  });
});

describe('microdata extractArtefactValues tests', () => {
  it('complete case', () => {
    const codelists = [
      {
        id: 'cl1',
        __index: 0,
        isDimension: true,
        values: [
          {
            id: 'W',
            __indexPosition: 0,
            parent: undefined,
            parents: [],
            __index: 0,
          },
          {
            id: 'OECD',
            __indexPosition: 3,
            parent: 'W',
            parents: ['W'],
            __index: 1,
          },
          {
            id: 'USA',
            __indexPosition: 6,
            parent: 'OECD',
            parents: ['W', 'OECD'],
            __index: 4,
          },
          {
            id: 'FRA',
            __indexPosition: 4,
            parent: 'OECD',
            parents: ['W', 'OECD'],
            __index: 5,
          },
          {
            id: 'GER',
            __indexPosition: 5,
            parent: 'OECD',
            parents: ['W', 'OECD'],
            __index: 6,
          },
          {
            id: 'EU',
            __indexPosition: 1,
            parent: 'W',
            parents: ['W'],
            __index: 2,
          },
          {
            id: 'GER',
            __indexPosition: 5,
            parent: 'EU',
            parents: ['W', 'EU'],
            __index: 6,
          },
          {
            id: 'FRA',
            __indexPosition: 4,
            parent: 'EU',
            parents: ['W', 'EU'],
            __index: 5,
          },
          {
            id: 'A',
            __indexPosition: 2,
            parent: 'W',
            parents: ['W'],
            __index: 3,
          },
          {
            id: 'USA',
            __indexPosition: 6,
            parent: 'A',
            parents: ['W', 'A'],
            __index: 4,
          },
        ],
      },
      {
        id: 'cl2',
        __index: 2,
        isDimension: true,
        values: [
          {
            id: 'v',
            __indexPosition: 0,
            parent: undefined,
            parents: [],
            __index: 0,
          },
        ],
      },
      {
        id: 'cl3',
        __index: 2,
        isAttribute: true,
        values: [
          {
            id: 'V1',
            __indexPosition: 0,
            parent: undefined,
            parents: [],
            __index: 0,
          },
          {
            id: 'V2',
            __indexPosition: 1,
            parent: undefined,
            parents: [],
            __index: 1,
          },
        ],
      },
    ];

    const observations = [
      ['0:0:0:0', [0, null, null, 0]],
      ['1:0:0:0', [1, null, null, 0]],
      ['2:0:0:0', [2, null, null, 0]],
      ['3:0:0:0', [3, null, null, 1]],
      ['4:0:0:0', [4, null, null, 1]],
      ['5:0:0:0', [5, null, null, 1]],
      ['6:0:0:0', [6, null, null, 1]],
    ];

    const expected = [
      {
        cl1: {
          artefact: {
            id: 'cl1',
            __index: 0,
            isDimension: true,
            values: [
              {
                id: 'W',
                __indexPosition: 0,
                parent: undefined,
                parents: [],
                __index: 0,
              },
              {
                id: 'OECD',
                __indexPosition: 3,
                parent: 'W',
                parents: ['W'],
                __index: 1,
              },
              {
                id: 'USA',
                __indexPosition: 6,
                parent: 'OECD',
                parents: ['W', 'OECD'],
                __index: 4,
              },
              {
                id: 'FRA',
                __indexPosition: 4,
                parent: 'OECD',
                parents: ['W', 'OECD'],
                __index: 5,
              },
              {
                id: 'GER',
                __indexPosition: 5,
                parent: 'OECD',
                parents: ['W', 'OECD'],
                __index: 6,
              },
              {
                id: 'EU',
                __indexPosition: 1,
                parent: 'W',
                parents: ['W'],
                __index: 2,
              },
              {
                id: 'GER',
                __indexPosition: 5,
                parent: 'EU',
                parents: ['W', 'EU'],
                __index: 6,
              },
              {
                id: 'FRA',
                __indexPosition: 4,
                parent: 'EU',
                parents: ['W', 'EU'],
                __index: 5,
              },
              {
                id: 'A',
                __indexPosition: 2,
                parent: 'W',
                parents: ['W'],
                __index: 3,
              },
              {
                id: 'USA',
                __indexPosition: 6,
                parent: 'A',
                parents: ['W', 'A'],
                __index: 4,
              },
            ],
          },
          value: {
            id: 'W',
            __indexPosition: 0,
            parent: undefined,
            parents: [],
            __index: 0,
          },
          type: 'dimension',
        },
        cl2: {
          artefact: {
            id: 'cl2',
            __index: 2,
            isDimension: true,
            values: [
              {
                id: 'v',
                __indexPosition: 0,
                parent: undefined,
                parents: [],
                __index: 0,
              },
            ],
          },
          value: {
            id: 'v',
            __indexPosition: 0,
            parent: undefined,
            parents: [],
            __index: 0,
          },
          type: 'dimension',
        },
        cl3: {
          artefact: {
            id: 'cl3',
            __index: 2,
            isAttribute: true,
            values: [
              {
                id: 'V1',
                __indexPosition: 0,
                parent: undefined,
                parents: [],
                __index: 0,
              },
              {
                id: 'V2',
                __indexPosition: 1,
                parent: undefined,
                parents: [],
                __index: 1,
              },
            ],
          },
          value: {
            id: 'V1',
            __indexPosition: 0,
            parent: undefined,
            parents: [],
            __index: 0,
          },
          type: 'attribute',
        },
        value: 0,
      },
      {
        cl1: {
          artefact: {
            id: 'cl1',
            __index: 0,
            isDimension: true,
            values: [
              {
                id: 'W',
                __indexPosition: 0,
                parent: undefined,
                parents: [],
                __index: 0,
              },
              {
                id: 'OECD',
                __indexPosition: 3,
                parent: 'W',
                parents: ['W'],
                __index: 1,
              },
              {
                id: 'USA',
                __indexPosition: 6,
                parent: 'OECD',
                parents: ['W', 'OECD'],
                __index: 4,
              },
              {
                id: 'FRA',
                __indexPosition: 4,
                parent: 'OECD',
                parents: ['W', 'OECD'],
                __index: 5,
              },
              {
                id: 'GER',
                __indexPosition: 5,
                parent: 'OECD',
                parents: ['W', 'OECD'],
                __index: 6,
              },
              {
                id: 'EU',
                __indexPosition: 1,
                parent: 'W',
                parents: ['W'],
                __index: 2,
              },
              {
                id: 'GER',
                __indexPosition: 5,
                parent: 'EU',
                parents: ['W', 'EU'],
                __index: 6,
              },
              {
                id: 'FRA',
                __indexPosition: 4,
                parent: 'EU',
                parents: ['W', 'EU'],
                __index: 5,
              },
              {
                id: 'A',
                __indexPosition: 2,
                parent: 'W',
                parents: ['W'],
                __index: 3,
              },
              {
                id: 'USA',
                __indexPosition: 6,
                parent: 'A',
                parents: ['W', 'A'],
                __index: 4,
              },
            ],
          },
          value: {
            id: 'OECD',
            __indexPosition: 3,
            parent: 'W',
            parents: ['W'],
            __index: 1,
          },
          type: 'dimension',
        },
        cl2: {
          artefact: {
            id: 'cl2',
            __index: 2,
            isDimension: true,
            values: [
              {
                id: 'v',
                __indexPosition: 0,
                parent: undefined,
                parents: [],
                __index: 0,
              },
            ],
          },
          value: {
            id: 'v',
            __indexPosition: 0,
            parent: undefined,
            parents: [],
            __index: 0,
          },
          type: 'dimension',
        },
        cl3: {
          artefact: {
            id: 'cl3',
            __index: 2,
            isAttribute: true,
            values: [
              {
                id: 'V1',
                __indexPosition: 0,
                parent: undefined,
                parents: [],
                __index: 0,
              },
              {
                id: 'V2',
                __indexPosition: 1,
                parent: undefined,
                parents: [],
                __index: 1,
              },
            ],
          },
          value: {
            id: 'V1',
            __indexPosition: 0,
            parent: undefined,
            parents: [],
            __index: 0,
          },
          type: 'attribute',
        },
        value: 1,
      },
      {
        cl1: {
          artefact: {
            id: 'cl1',
            __index: 0,
            isDimension: true,
            values: [
              {
                id: 'W',
                __indexPosition: 0,
                parent: undefined,
                parents: [],
                __index: 0,
              },
              {
                id: 'OECD',
                __indexPosition: 3,
                parent: 'W',
                parents: ['W'],
                __index: 1,
              },
              {
                id: 'USA',
                __indexPosition: 6,
                parent: 'OECD',
                parents: ['W', 'OECD'],
                __index: 4,
              },
              {
                id: 'FRA',
                __indexPosition: 4,
                parent: 'OECD',
                parents: ['W', 'OECD'],
                __index: 5,
              },
              {
                id: 'GER',
                __indexPosition: 5,
                parent: 'OECD',
                parents: ['W', 'OECD'],
                __index: 6,
              },
              {
                id: 'EU',
                __indexPosition: 1,
                parent: 'W',
                parents: ['W'],
                __index: 2,
              },
              {
                id: 'GER',
                __indexPosition: 5,
                parent: 'EU',
                parents: ['W', 'EU'],
                __index: 6,
              },
              {
                id: 'FRA',
                __indexPosition: 4,
                parent: 'EU',
                parents: ['W', 'EU'],
                __index: 5,
              },
              {
                id: 'A',
                __indexPosition: 2,
                parent: 'W',
                parents: ['W'],
                __index: 3,
              },
              {
                id: 'USA',
                __indexPosition: 6,
                parent: 'A',
                parents: ['W', 'A'],
                __index: 4,
              },
            ],
          },
          value: {
            id: 'USA',
            __indexPosition: 6,
            parent: 'OECD',
            parents: ['W', 'OECD'],
            __index: 4,
          },
          type: 'dimension',
        },
        cl2: {
          artefact: {
            id: 'cl2',
            __index: 2,
            isDimension: true,
            values: [
              {
                id: 'v',
                __indexPosition: 0,
                parent: undefined,
                parents: [],
                __index: 0,
              },
            ],
          },
          value: {
            id: 'v',
            __indexPosition: 0,
            parent: undefined,
            parents: [],
            __index: 0,
          },
          type: 'dimension',
        },
        cl3: {
          artefact: {
            id: 'cl3',
            __index: 2,
            isAttribute: true,
            values: [
              {
                id: 'V1',
                __indexPosition: 0,
                parent: undefined,
                parents: [],
                __index: 0,
              },
              {
                id: 'V2',
                __indexPosition: 1,
                parent: undefined,
                parents: [],
                __index: 1,
              },
            ],
          },
          value: {
            id: 'V2',
            __indexPosition: 1,
            parent: undefined,
            parents: [],
            __index: 1,
          },
          type: 'attribute',
        },
        value: 4,
      },
      {
        cl1: {
          artefact: {
            id: 'cl1',
            __index: 0,
            isDimension: true,
            values: [
              {
                id: 'W',
                __indexPosition: 0,
                parent: undefined,
                parents: [],
                __index: 0,
              },
              {
                id: 'OECD',
                __indexPosition: 3,
                parent: 'W',
                parents: ['W'],
                __index: 1,
              },
              {
                id: 'USA',
                __indexPosition: 6,
                parent: 'OECD',
                parents: ['W', 'OECD'],
                __index: 4,
              },
              {
                id: 'FRA',
                __indexPosition: 4,
                parent: 'OECD',
                parents: ['W', 'OECD'],
                __index: 5,
              },
              {
                id: 'GER',
                __indexPosition: 5,
                parent: 'OECD',
                parents: ['W', 'OECD'],
                __index: 6,
              },
              {
                id: 'EU',
                __indexPosition: 1,
                parent: 'W',
                parents: ['W'],
                __index: 2,
              },
              {
                id: 'GER',
                __indexPosition: 5,
                parent: 'EU',
                parents: ['W', 'EU'],
                __index: 6,
              },
              {
                id: 'FRA',
                __indexPosition: 4,
                parent: 'EU',
                parents: ['W', 'EU'],
                __index: 5,
              },
              {
                id: 'A',
                __indexPosition: 2,
                parent: 'W',
                parents: ['W'],
                __index: 3,
              },
              {
                id: 'USA',
                __indexPosition: 6,
                parent: 'A',
                parents: ['W', 'A'],
                __index: 4,
              },
            ],
          },
          value: {
            id: 'FRA',
            __indexPosition: 4,
            parent: 'OECD',
            parents: ['W', 'OECD'],
            __index: 5,
          },
          type: 'dimension',
        },
        cl2: {
          artefact: {
            id: 'cl2',
            __index: 2,
            isDimension: true,
            values: [
              {
                id: 'v',
                __indexPosition: 0,
                parent: undefined,
                parents: [],
                __index: 0,
              },
            ],
          },
          value: {
            id: 'v',
            __indexPosition: 0,
            parent: undefined,
            parents: [],
            __index: 0,
          },
          type: 'dimension',
        },
        cl3: {
          artefact: {
            id: 'cl3',
            __index: 2,
            isAttribute: true,
            values: [
              {
                id: 'V1',
                __indexPosition: 0,
                parent: undefined,
                parents: [],
                __index: 0,
              },
              {
                id: 'V2',
                __indexPosition: 1,
                parent: undefined,
                parents: [],
                __index: 1,
              },
            ],
          },
          value: {
            id: 'V2',
            __indexPosition: 1,
            parent: undefined,
            parents: [],
            __index: 1,
          },
          type: 'attribute',
        },
        value: 5,
      },
      {
        cl1: {
          artefact: {
            id: 'cl1',
            __index: 0,
            isDimension: true,
            values: [
              {
                id: 'W',
                __indexPosition: 0,
                parent: undefined,
                parents: [],
                __index: 0,
              },
              {
                id: 'OECD',
                __indexPosition: 3,
                parent: 'W',
                parents: ['W'],
                __index: 1,
              },
              {
                id: 'USA',
                __indexPosition: 6,
                parent: 'OECD',
                parents: ['W', 'OECD'],
                __index: 4,
              },
              {
                id: 'FRA',
                __indexPosition: 4,
                parent: 'OECD',
                parents: ['W', 'OECD'],
                __index: 5,
              },
              {
                id: 'GER',
                __indexPosition: 5,
                parent: 'OECD',
                parents: ['W', 'OECD'],
                __index: 6,
              },
              {
                id: 'EU',
                __indexPosition: 1,
                parent: 'W',
                parents: ['W'],
                __index: 2,
              },
              {
                id: 'GER',
                __indexPosition: 5,
                parent: 'EU',
                parents: ['W', 'EU'],
                __index: 6,
              },
              {
                id: 'FRA',
                __indexPosition: 4,
                parent: 'EU',
                parents: ['W', 'EU'],
                __index: 5,
              },
              {
                id: 'A',
                __indexPosition: 2,
                parent: 'W',
                parents: ['W'],
                __index: 3,
              },
              {
                id: 'USA',
                __indexPosition: 6,
                parent: 'A',
                parents: ['W', 'A'],
                __index: 4,
              },
            ],
          },
          value: {
            id: 'GER',
            __indexPosition: 5,
            parent: 'OECD',
            parents: ['W', 'OECD'],
            __index: 6,
          },
          type: 'dimension',
        },
        cl2: {
          artefact: {
            id: 'cl2',
            __index: 2,
            isDimension: true,
            values: [
              {
                id: 'v',
                __indexPosition: 0,
                parent: undefined,
                parents: [],
                __index: 0,
              },
            ],
          },
          value: {
            id: 'v',
            __indexPosition: 0,
            parent: undefined,
            parents: [],
            __index: 0,
          },
          type: 'dimension',
        },
        cl3: {
          artefact: {
            id: 'cl3',
            __index: 2,
            isAttribute: true,
            values: [
              {
                id: 'V1',
                __indexPosition: 0,
                parent: undefined,
                parents: [],
                __index: 0,
              },
              {
                id: 'V2',
                __indexPosition: 1,
                parent: undefined,
                parents: [],
                __index: 1,
              },
            ],
          },
          value: {
            id: 'V2',
            __indexPosition: 1,
            parent: undefined,
            parents: [],
            __index: 1,
          },
          type: 'attribute',
        },
        value: 6,
      },
      {
        cl1: {
          artefact: {
            id: 'cl1',
            __index: 0,
            isDimension: true,
            values: [
              {
                id: 'W',
                __indexPosition: 0,
                parent: undefined,
                parents: [],
                __index: 0,
              },
              {
                id: 'OECD',
                __indexPosition: 3,
                parent: 'W',
                parents: ['W'],
                __index: 1,
              },
              {
                id: 'USA',
                __indexPosition: 6,
                parent: 'OECD',
                parents: ['W', 'OECD'],
                __index: 4,
              },
              {
                id: 'FRA',
                __indexPosition: 4,
                parent: 'OECD',
                parents: ['W', 'OECD'],
                __index: 5,
              },
              {
                id: 'GER',
                __indexPosition: 5,
                parent: 'OECD',
                parents: ['W', 'OECD'],
                __index: 6,
              },
              {
                id: 'EU',
                __indexPosition: 1,
                parent: 'W',
                parents: ['W'],
                __index: 2,
              },
              {
                id: 'GER',
                __indexPosition: 5,
                parent: 'EU',
                parents: ['W', 'EU'],
                __index: 6,
              },
              {
                id: 'FRA',
                __indexPosition: 4,
                parent: 'EU',
                parents: ['W', 'EU'],
                __index: 5,
              },
              {
                id: 'A',
                __indexPosition: 2,
                parent: 'W',
                parents: ['W'],
                __index: 3,
              },
              {
                id: 'USA',
                __indexPosition: 6,
                parent: 'A',
                parents: ['W', 'A'],
                __index: 4,
              },
            ],
          },
          value: {
            id: 'EU',
            __indexPosition: 1,
            parent: 'W',
            parents: ['W'],
            __index: 2,
          },
          type: 'dimension',
        },
        cl2: {
          artefact: {
            id: 'cl2',
            __index: 2,
            isDimension: true,
            values: [
              {
                id: 'v',
                __indexPosition: 0,
                parent: undefined,
                parents: [],
                __index: 0,
              },
            ],
          },
          value: {
            id: 'v',
            __indexPosition: 0,
            parent: undefined,
            parents: [],
            __index: 0,
          },
          type: 'dimension',
        },
        cl3: {
          artefact: {
            id: 'cl3',
            __index: 2,
            isAttribute: true,
            values: [
              {
                id: 'V1',
                __indexPosition: 0,
                parent: undefined,
                parents: [],
                __index: 0,
              },
              {
                id: 'V2',
                __indexPosition: 1,
                parent: undefined,
                parents: [],
                __index: 1,
              },
            ],
          },
          value: {
            id: 'V1',
            __indexPosition: 0,
            parent: undefined,
            parents: [],
            __index: 0,
          },
          type: 'attribute',
        },
        value: 2,
      },
      {
        cl1: {
          artefact: {
            id: 'cl1',
            __index: 0,
            isDimension: true,
            values: [
              {
                id: 'W',
                __indexPosition: 0,
                parent: undefined,
                parents: [],
                __index: 0,
              },
              {
                id: 'OECD',
                __indexPosition: 3,
                parent: 'W',
                parents: ['W'],
                __index: 1,
              },
              {
                id: 'USA',
                __indexPosition: 6,
                parent: 'OECD',
                parents: ['W', 'OECD'],
                __index: 4,
              },
              {
                id: 'FRA',
                __indexPosition: 4,
                parent: 'OECD',
                parents: ['W', 'OECD'],
                __index: 5,
              },
              {
                id: 'GER',
                __indexPosition: 5,
                parent: 'OECD',
                parents: ['W', 'OECD'],
                __index: 6,
              },
              {
                id: 'EU',
                __indexPosition: 1,
                parent: 'W',
                parents: ['W'],
                __index: 2,
              },
              {
                id: 'GER',
                __indexPosition: 5,
                parent: 'EU',
                parents: ['W', 'EU'],
                __index: 6,
              },
              {
                id: 'FRA',
                __indexPosition: 4,
                parent: 'EU',
                parents: ['W', 'EU'],
                __index: 5,
              },
              {
                id: 'A',
                __indexPosition: 2,
                parent: 'W',
                parents: ['W'],
                __index: 3,
              },
              {
                id: 'USA',
                __indexPosition: 6,
                parent: 'A',
                parents: ['W', 'A'],
                __index: 4,
              },
            ],
          },
          value: {
            id: 'GER',
            __indexPosition: 5,
            parent: 'EU',
            parents: ['W', 'EU'],
            __index: 6,
          },
          type: 'dimension',
        },
        cl2: {
          artefact: {
            id: 'cl2',
            __index: 2,
            isDimension: true,
            values: [
              {
                id: 'v',
                __indexPosition: 0,
                parent: undefined,
                parents: [],
                __index: 0,
              },
            ],
          },
          value: {
            id: 'v',
            __indexPosition: 0,
            parent: undefined,
            parents: [],
            __index: 0,
          },
          type: 'dimension',
        },
        cl3: {
          artefact: {
            id: 'cl3',
            __index: 2,
            isAttribute: true,
            values: [
              {
                id: 'V1',
                __indexPosition: 0,
                parent: undefined,
                parents: [],
                __index: 0,
              },
              {
                id: 'V2',
                __indexPosition: 1,
                parent: undefined,
                parents: [],
                __index: 1,
              },
            ],
          },
          value: {
            id: 'V2',
            __indexPosition: 1,
            parent: undefined,
            parents: [],
            __index: 1,
          },
          type: 'attribute',
        },
        value: 6,
      },
      {
        cl1: {
          artefact: {
            id: 'cl1',
            __index: 0,
            isDimension: true,
            values: [
              {
                id: 'W',
                __indexPosition: 0,
                parent: undefined,
                parents: [],
                __index: 0,
              },
              {
                id: 'OECD',
                __indexPosition: 3,
                parent: 'W',
                parents: ['W'],
                __index: 1,
              },
              {
                id: 'USA',
                __indexPosition: 6,
                parent: 'OECD',
                parents: ['W', 'OECD'],
                __index: 4,
              },
              {
                id: 'FRA',
                __indexPosition: 4,
                parent: 'OECD',
                parents: ['W', 'OECD'],
                __index: 5,
              },
              {
                id: 'GER',
                __indexPosition: 5,
                parent: 'OECD',
                parents: ['W', 'OECD'],
                __index: 6,
              },
              {
                id: 'EU',
                __indexPosition: 1,
                parent: 'W',
                parents: ['W'],
                __index: 2,
              },
              {
                id: 'GER',
                __indexPosition: 5,
                parent: 'EU',
                parents: ['W', 'EU'],
                __index: 6,
              },
              {
                id: 'FRA',
                __indexPosition: 4,
                parent: 'EU',
                parents: ['W', 'EU'],
                __index: 5,
              },
              {
                id: 'A',
                __indexPosition: 2,
                parent: 'W',
                parents: ['W'],
                __index: 3,
              },
              {
                id: 'USA',
                __indexPosition: 6,
                parent: 'A',
                parents: ['W', 'A'],
                __index: 4,
              },
            ],
          },
          value: {
            id: 'FRA',
            __indexPosition: 4,
            parent: 'EU',
            parents: ['W', 'EU'],
            __index: 5,
          },
          type: 'dimension',
        },
        cl2: {
          artefact: {
            id: 'cl2',
            __index: 2,
            isDimension: true,
            values: [
              {
                id: 'v',
                __indexPosition: 0,
                parent: undefined,
                parents: [],
                __index: 0,
              },
            ],
          },
          value: {
            id: 'v',
            __indexPosition: 0,
            parent: undefined,
            parents: [],
            __index: 0,
          },
          type: 'dimension',
        },
        cl3: {
          artefact: {
            id: 'cl3',
            __index: 2,
            isAttribute: true,
            values: [
              {
                id: 'V1',
                __indexPosition: 0,
                parent: undefined,
                parents: [],
                __index: 0,
              },
              {
                id: 'V2',
                __indexPosition: 1,
                parent: undefined,
                parents: [],
                __index: 1,
              },
            ],
          },
          value: {
            id: 'V2',
            __indexPosition: 1,
            parent: undefined,
            parents: [],
            __index: 1,
          },
          type: 'attribute',
        },
        value: 5,
      },
      {
        cl1: {
          artefact: {
            id: 'cl1',
            __index: 0,
            isDimension: true,
            values: [
              {
                id: 'W',
                __indexPosition: 0,
                parent: undefined,
                parents: [],
                __index: 0,
              },
              {
                id: 'OECD',
                __indexPosition: 3,
                parent: 'W',
                parents: ['W'],
                __index: 1,
              },
              {
                id: 'USA',
                __indexPosition: 6,
                parent: 'OECD',
                parents: ['W', 'OECD'],
                __index: 4,
              },
              {
                id: 'FRA',
                __indexPosition: 4,
                parent: 'OECD',
                parents: ['W', 'OECD'],
                __index: 5,
              },
              {
                id: 'GER',
                __indexPosition: 5,
                parent: 'OECD',
                parents: ['W', 'OECD'],
                __index: 6,
              },
              {
                id: 'EU',
                __indexPosition: 1,
                parent: 'W',
                parents: ['W'],
                __index: 2,
              },
              {
                id: 'GER',
                __indexPosition: 5,
                parent: 'EU',
                parents: ['W', 'EU'],
                __index: 6,
              },
              {
                id: 'FRA',
                __indexPosition: 4,
                parent: 'EU',
                parents: ['W', 'EU'],
                __index: 5,
              },
              {
                id: 'A',
                __indexPosition: 2,
                parent: 'W',
                parents: ['W'],
                __index: 3,
              },
              {
                id: 'USA',
                __indexPosition: 6,
                parent: 'A',
                parents: ['W', 'A'],
                __index: 4,
              },
            ],
          },
          value: {
            id: 'A',
            __indexPosition: 2,
            parent: 'W',
            parents: ['W'],
            __index: 3,
          },
          type: 'dimension',
        },
        cl2: {
          artefact: {
            id: 'cl2',
            __index: 2,
            isDimension: true,
            values: [
              {
                id: 'v',
                __indexPosition: 0,
                parent: undefined,
                parents: [],
                __index: 0,
              },
            ],
          },
          value: {
            id: 'v',
            __indexPosition: 0,
            parent: undefined,
            parents: [],
            __index: 0,
          },
          type: 'dimension',
        },
        cl3: {
          artefact: {
            id: 'cl3',
            __index: 2,
            isAttribute: true,
            values: [
              {
                id: 'V1',
                __indexPosition: 0,
                parent: undefined,
                parents: [],
                __index: 0,
              },
              {
                id: 'V2',
                __indexPosition: 1,
                parent: undefined,
                parents: [],
                __index: 1,
              },
            ],
          },
          value: {
            id: 'V2',
            __indexPosition: 1,
            parent: undefined,
            parents: [],
            __index: 1,
          },
          type: 'attribute',
        },
        value: 3,
      },
      {
        cl1: {
          artefact: {
            id: 'cl1',
            __index: 0,
            isDimension: true,
            values: [
              {
                id: 'W',
                __indexPosition: 0,
                parent: undefined,
                parents: [],
                __index: 0,
              },
              {
                id: 'OECD',
                __indexPosition: 3,
                parent: 'W',
                parents: ['W'],
                __index: 1,
              },
              {
                id: 'USA',
                __indexPosition: 6,
                parent: 'OECD',
                parents: ['W', 'OECD'],
                __index: 4,
              },
              {
                id: 'FRA',
                __indexPosition: 4,
                parent: 'OECD',
                parents: ['W', 'OECD'],
                __index: 5,
              },
              {
                id: 'GER',
                __indexPosition: 5,
                parent: 'OECD',
                parents: ['W', 'OECD'],
                __index: 6,
              },
              {
                id: 'EU',
                __indexPosition: 1,
                parent: 'W',
                parents: ['W'],
                __index: 2,
              },
              {
                id: 'GER',
                __indexPosition: 5,
                parent: 'EU',
                parents: ['W', 'EU'],
                __index: 6,
              },
              {
                id: 'FRA',
                __indexPosition: 4,
                parent: 'EU',
                parents: ['W', 'EU'],
                __index: 5,
              },
              {
                id: 'A',
                __indexPosition: 2,
                parent: 'W',
                parents: ['W'],
                __index: 3,
              },
              {
                id: 'USA',
                __indexPosition: 6,
                parent: 'A',
                parents: ['W', 'A'],
                __index: 4,
              },
            ],
          },
          value: {
            id: 'USA',
            __indexPosition: 6,
            parent: 'A',
            parents: ['W', 'A'],
            __index: 4,
          },
          type: 'dimension',
        },
        cl2: {
          artefact: {
            id: 'cl2',
            __index: 2,
            isDimension: true,
            values: [
              {
                id: 'v',
                __indexPosition: 0,
                parent: undefined,
                parents: [],
                __index: 0,
              },
            ],
          },
          value: {
            id: 'v',
            __indexPosition: 0,
            parent: undefined,
            parents: [],
            __index: 0,
          },
          type: 'dimension',
        },
        cl3: {
          artefact: {
            id: 'cl3',
            __index: 2,
            isAttribute: true,
            values: [
              {
                id: 'V1',
                __indexPosition: 0,
                parent: undefined,
                parents: [],
                __index: 0,
              },
              {
                id: 'V2',
                __indexPosition: 1,
                parent: undefined,
                parents: [],
                __index: 1,
              },
            ],
          },
          value: {
            id: 'V2',
            __indexPosition: 1,
            parent: undefined,
            parents: [],
            __index: 1,
          },
          type: 'attribute',
        },
        value: 4,
      },
    ];

    expect(extractArtefactValues(codelists, observations)).toEqual(expected);
  });
});

describe('microdata getMissingRows tests', () => {
  it('no missing rows', () => {
    const columns = [
      { id: 'Col0' },
      { id: 'Col1' },
      { id: 'Col2' },
      { id: 'value' },
    ];

    const previousSerie = [
      { value: { __indexPosition: 0, parents: [] } },
      { value: { __indexPosition: 2, parents: [0, 1] } },
      { value: { __indexPosition: 5, parents: [] } },
      0,
    ];

    const serie = {
      Col0: {
        artefact: { id: 'Col0' },
        value: { __indexPosition: 4, parents: [0] },
      },
      Col1: {
        artefact: {
          id: 'Col1',
          values: [
            { __indexPosition: 0, parents: [], isSelected: false },
            { __indexPosition: 1, parents: [0], isSelected: false },
            { __indexPosition: 2, parents: [0, 1], isSelected: false },
            { __indexPosition: 3, parents: [0, 1, 2], isSelected: false },
          ],
        },
        value: { __indexPosition: 3, parents: [0, 1, 2] },
      },
      Col2: {
        artefact: { id: 'Col2' },
        value: { __indexPosition: 10, parents: [] },
      },
      value: 1,
    };

    expect(getMissingRows(serie, previousSerie, columns)).toEqual([
      [
        {
          artefact: { id: 'Col0' },
          value: { __indexPosition: 4, parents: [0] },
        },
        {
          artefact: { id: 'Col1' },
          value: { __indexPosition: 3, parents: [] },
        }, // since first columns are not the same, here previous is not considered as parent
        {
          artefact: { id: 'Col2' },
          value: { __indexPosition: 10, parents: [] },
        },
        1,
      ],
    ]);
  });
  it('multiple missing rows with partial hierarchies', () => {
    const columns = [
      { id: 'Col0' },
      { id: 'Col1' },
      { id: 'Col2' },
      { id: 'value' },
    ];

    const previousSerie = [
      { value: { __indexPosition: 0, parents: [] } },
      { value: { __indexPosition: 0, parents: [] } },
      { value: { __indexPosition: 0, parents: [] } },
      0,
    ];

    const serie = {
      Col0: {
        artefact: {
          id: 'Col0',
          values: [
            { __indexPosition: 0, parents: [], isSelected: true },
            { __indexPosition: 1, parents: [0], isSelected: false },
            { __indexPosition: 2, parents: [0, 1], isSelected: true },
            { __indexPosition: 3, parents: [0, 1, 2], isSelected: true },
          ],
        },
        value: { __indexPosition: 3, parents: [0, 1, 2], isSelected: true },
      },
      Col1: {
        artefact: {
          id: 'Col1',
          values: [
            { __indexPosition: 0, parents: [], isSelected: false },
            { __indexPosition: 1, parents: [0], isSelected: true },
            { __indexPosition: 2, parents: [0, 1], isSelected: true },
            { __indexPosition: 3, parents: [0, 1, 2], isSelected: true },
          ],
        },
        value: { __indexPosition: 3, parents: [0, 1, 2], isSelected: true },
      },
      Col2: {
        artefact: {
          id: 'Col2',
          values: [
            { __indexPosition: 0, parents: [], isSelected: true },
            { __indexPosition: 1, parents: [], isSelected: true },
          ],
        },
        value: { __indexPosition: 1, parents: [], isSelected: true },
      },
      value: 1,
    };

    expect(getMissingRows(serie, previousSerie, columns)).toEqual([
      [
        {
          artefact: { id: 'Col0' },
          value: { __indexPosition: 2, parents: [0], isSelected: true },
        },
        null,
        null,
        null,
      ],
      [
        {
          artefact: { id: 'Col0' },
          value: { __indexPosition: 3, parents: [0, 2], isSelected: true },
        },
        {
          artefact: { id: 'Col1' },
          value: { __indexPosition: 1, parents: [], isSelected: true },
        },
        null,
        null,
      ],
      [
        {
          artefact: { id: 'Col0' },
          value: { __indexPosition: 3, parents: [0, 2], isSelected: true },
        },
        {
          artefact: { id: 'Col1' },
          value: { __indexPosition: 2, parents: [1], isSelected: true },
        },
        null,
        null,
      ],
      [
        {
          artefact: { id: 'Col0' },
          value: { __indexPosition: 3, parents: [0, 2], isSelected: true },
        },
        {
          artefact: { id: 'Col1' },
          value: { __indexPosition: 3, parents: [1, 2], isSelected: true },
        },
        {
          artefact: { id: 'Col2' },
          value: { __indexPosition: 1, parents: [], isSelected: true },
        },
        1,
      ],
    ]);
  });
});

describe('microdata getDescendantsFromHC, tests', () => {
  const hierarchy = {
    '#ROOT': ['W'],
    W: ['EU', 'OECD'],
    'W.EU': ['FRA', 'GER', 'BEL'],
    'W.OECD': ['USA', 'GER', 'FRA'],
  };
  it('no children for value in hierarchy', () => {
    expect(getDescendantsFromHCL('FRA', hierarchy)).toEqual(['FRA']);
  });
  it('multiple children for value in hierarchy', () => {
    expect(getDescendantsFromHCL('W', hierarchy)).toEqual([
      'EU',
      'OECD',
      'FRA',
      'GER',
      'BEL',
      'USA',
      'W',
    ]);
  });
});
