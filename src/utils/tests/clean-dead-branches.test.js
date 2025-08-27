import { cleanDeadBranches } from '../clean-dead-branches';

describe('DE - utils - makeTree', () => {
  test('should empty array no items', () => {
    expect(cleanDeadBranches([])).toEqual([]);
  });
  test('flat list with one branch', () => {
    const items = [
      { id: 1, label: 'abc', hasData: false },
      { id: 20, parentId: 1, label: 'abd2', hasData: false },
      { id: 30, parentId: 1, label: 'abd3', hasData: false },
      { id: 200, parentId: 20, label: 'bcd2', hasData: true },
    ];
    const expected = [
      { id: 1, label: 'abc', hasData: false },
      { id: 20, parentId: 1, label: 'abd2', hasData: false },
      { id: 200, parentId: 20, label: 'bcd2', hasData: true },
    ];
    expect(cleanDeadBranches(items)).toEqual(expected);
  });
  test('flat list with two branches', () => {
    const items = [
      { id: 220, parentId: 2, label: '22', hasData: true },
      { id: 1, label: 'abc', hasData: false },
      { id: 2, label: 'abc2', hasData: false },
      { id: 20, parentId: 1, label: 'abd2', hasData: false },
      { id: 30, parentId: 1, label: 'abd3', hasData: false },
      { id: 200, parentId: 20, label: 'bcd2', hasData: true },
    ];
    const expected = [
      { id: 220, parentId: 2, label: '22', hasData: true },
      { id: 1, label: 'abc', hasData: false },
      { id: 2, label: 'abc2', hasData: false },
      { id: 20, parentId: 1, label: 'abd2', hasData: false },
      { id: 200, parentId: 20, label: 'bcd2', hasData: true },
    ];
    expect(cleanDeadBranches(items)).toEqual(expected);
  });
  test('flat list with data only in the middle', () => {
    const items = [
      { id: 1, label: 'abc', hasData: false },
      { id: 2, label: 'abc2', hasData: false },
      { id: 20, parentId: 1, label: 'abd2', hasData: false },
      { id: 200, parentId: 20, label: 'bcd2', hasData: true },
      { id: 2000, parentId: 200, label: 'bcd3', hasData: false },
      { id: 20000, parentId: 2000, label: 'bcd4', hasData: false },
    ];
    const expected = [
      { id: 1, label: 'abc', hasData: false },
      { id: 20, parentId: 1, label: 'abd2', hasData: false },
      { id: 200, parentId: 20, label: 'bcd2', hasData: true },
    ];
    expect(cleanDeadBranches(items)).toEqual(expected);
  });
  test('no data', () => {
    const items = [
      { id: 1, label: 'abc', hasData: false },
      { id: 2, label: 'abc2', hasData: false },
      { id: 20, parentId: 1, label: 'abd2', hasData: false },
      { id: 200, parentId: 20, label: 'bcd2', hasData: false },
      { id: 2000, parentId: 200, label: 'bcd3', hasData: false },
      { id: 20000, parentId: 2000, label: 'bcd4', hasData: false },
    ];
    expect(cleanDeadBranches(items)).toEqual([]);
  });
});
