import { selectAutomatedSelections } from '../selection';

describe('selectAutomatedSelections', () => {
  it('complete case', () => {
    const dimensions = [
      {
        id: 'D1',
        values: [
          { id: 'ROOT.1' },
          { id: 'ROOT.2' },
          { id: 'ROOT.3' },
          { id: 'LEVEL1.1', parentId: 'ROOT.2' },
          { id: 'LEVEL1.2', parentId: 'ROOT.2' },
          { id: 'LEVEL1.3', parentId: 'ROOT.3' },
          { id: 'LEVEL2.1', parentId: 'LEVEL1.2' },
        ],
      },
      {
        id: 'D2',
        values: [
          { id: 'ROOT.1' },
          { id: 'ROOT.2' },
          { id: 'ROOT.3' },
          { id: 'LEVEL1.1', parentId: 'ROOT.2' },
          { id: 'LEVEL1.2', parentId: 'ROOT.2' },
          { id: 'LEVEL1.3', parentId: 'ROOT.3' },
          { id: 'LEVEL2.1', parentId: 'LEVEL1.2' },
        ],
      },
      {
        id: 'D3',
        values: [
          { id: 'ROOT.1' },
          { id: 'ROOT.2' },
          { id: 'ROOT.3' },
          { id: 'LEVEL1.1', parentId: 'ROOT.2' },
          { id: 'LEVEL1.2', parentId: 'ROOT.2' },
          { id: 'LEVEL1.3', parentId: 'ROOT.3' },
          { id: 'LEVEL2.1', parentId: 'LEVEL1.2' },
        ],
      },
      {
        id: 'D4',
        values: [
          { id: 'ROOT.1' },
          { id: 'ROOT.2' },
          { id: 'ROOT.3' },
          { id: 'LEVEL1.1', parentId: 'ROOT.2' },
          { id: 'LEVEL1.2', parentId: 'ROOT.2' },
          { id: 'LEVEL1.3', parentId: 'ROOT.3' },
          { id: 'LEVEL2.1', parentId: 'LEVEL1.2' },
        ],
      },
      {
        id: 'D5',
        values: [
          { id: 'ROOT.1' },
          { id: 'ROOT.2' },
          { id: 'ROOT.3' },
          { id: 'LEVEL1.1', parentId: 'ROOT.2' },
          { id: 'LEVEL1.2', parentId: 'ROOT.2' },
          { id: 'LEVEL1.3', parentId: 'ROOT.3' },
          { id: 'LEVEL2.1', parentId: 'LEVEL1.2' },
        ],
      },
      {
        id: 'D6',
        values: [
          { id: 'WORLD' },
          { id: 'AMERICA' },
          { id: 'NORTH_AMERICA' },
          { id: 'EUROPE' },
          { id: 'OECD' },
          { id: 'USA' },
          { id: 'FRA' },
        ],
      },
      {
        id: 'D7',
        values: [
          { id: 'WORLD' },
          { id: 'AMERICA' },
          { id: 'NORTH_AMERICA' },
          { id: 'EUROPE' },
          { id: 'OECD' },
          { id: 'USA' },
          { id: 'FRA' },
        ],
      },
      {
        id: 'D8',
        values: [
          { id: 'WORLD' },
          { id: 'AMERICA' },
          { id: 'NORTH_AMERICA' },
          { id: 'EUROPE' },
          { id: 'OECD' },
          { id: 'USA' },
          { id: 'FRA' },
        ],
      },
    ];

    const hierarchies = {
      D6: {
        '#ROOT': ['OECD', 'WORLD'],
        OECD: ['USA', 'FRA'],
        WORLD: ['AMERICA', 'EUROPE'],
        'WORLD.AMERICA': ['NORTH_AMERICA'],
        'WORLD.AMERICA.NORTH_AMERICA': ['USA'],
        'WORLD.EUROPE': ['FRA'],
      },
      D7: {
        '#ROOT': ['OECD', 'WORLD'],
        OECD: ['USA', 'FRA'],
        WORLD: ['AMERICA', 'EUROPE'],
        'WORLD.AMERICA': ['NORTH_AMERICA'],
        'WORLD.AMERICA.NORTH_AMERICA': ['USA'],
        'WORLD.EUROPE': ['FRA'],
      },
      D8: {
        '#ROOT': ['OECD', 'WORLD'],
        OECD: ['USA', 'FRA'],
        WORLD: ['AMERICA', 'EUROPE'],
        'WORLD.AMERICA': ['NORTH_AMERICA'],
        'WORLD.AMERICA.NORTH_AMERICA': ['USA'],
        'WORLD.EUROPE': ['FRA'],
      },
    };

    const imposedLevels = {
      D1: [],
      D2: [],
      D3: [0, 2, 3],
      D4: [],
      D7: [],
      D8: [0, 2, 5],
    };

    const selection = {
      D1: ['LEVEL2.1', 'ROOT.3'],
      D3: ['LEVEL2.1', 'ROOT.3'],
      D4: ['ROOT.1', 'ROOT.2', 'ROOT.3'],
      D5: ['LEVEL2.1', 'ROOT.3'],
      D6: ['FRA', 'USA'],
      D7: ['FRA', 'USA'],
      D8: ['FRA', 'USA'],
    };

    expect(
      selectAutomatedSelections(
        selection,
        dimensions,
        imposedLevels,
        hierarchies,
      ),
    ).toEqual({
      D1: ['ROOT.2', 'LEVEL1.2', 'LEVEL2.1', 'ROOT.3'],
      D3: ['ROOT.2', 'LEVEL2.1', 'ROOT.3'],
      D4: ['ROOT.1', 'ROOT.2', 'ROOT.3'],
      D5: ['LEVEL2.1', 'ROOT.3'],
      D6: ['FRA', 'USA'],
      D7: ['OECD', 'WORLD', 'EUROPE', 'FRA', 'AMERICA', 'NORTH_AMERICA', 'USA'],
      D8: ['OECD', 'WORLD', 'FRA', 'NORTH_AMERICA', 'USA'],
    });
  });
});
