import { makeSelectedHierarchySchemesList } from '../structured-hierarchies-overview';

describe('makeSelectedHierarchySchemesList', () => {
  it('should return an array grouped by id ', () => {
    const initialArr = [
      { id: 1, values: [{ name: 'a' }] },
      { id: 1, values: [{ name: 'b' }] },
      { id: 1, values: [{ name: 'c' }] },
      { id: 1, values: [{ name: 'd' }, { name: 'd-e' }] },
      { id: 2, values: [{ name: 'z' }] },
    ];
    const expected = [
      {
        id: 1,
        values: [
          [{ name: 'a' }],
          [{ name: 'b' }],
          [{ name: 'c' }],
          [{ name: 'd' }, { name: 'd-e' }],
        ],
      },
      { id: 2, values: [[{ name: 'z' }]] },
    ];
    expect(makeSelectedHierarchySchemesList(initialArr)).toEqual(expected);
  });
  it('should return an array grouped by id and empty values array when undefined', () => {
    const initialArr = [
      { id: 1, values: [{ name: 'a' }] },
      { id: 1, values: [{ name: 'b' }] },
      { id: 1, values: [{ name: 'c' }] },
      { id: 1, values: [{ name: 'd' }, { name: 'd-e' }] },
      { id: 2, values: [{ name: 'z' }] },
      { id: 3 },
    ];
    const expected = [
      {
        id: 1,
        values: [
          [{ name: 'a' }],
          [{ name: 'b' }],
          [{ name: 'c' }],
          [{ name: 'd' }, { name: 'd-e' }],
        ],
      },
      { id: 2, values: [[{ name: 'z' }]] },
      { id: 3, values: [] },
    ];
    expect(makeSelectedHierarchySchemesList(initialArr)).toEqual(expected);
  });
});
