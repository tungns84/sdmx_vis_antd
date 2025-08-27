import { computeHasSpotlight } from '../';

describe('DE - utils - makeTree', () => {
  test('should false no items', () => {
    const items = [];
    const expected = false;
    expect(computeHasSpotlight(items)).toEqual(expected);
  });
  test('should false only 3 items', () => {
    const items = [
      { id: 'ASIKHM', label: 'Cambodia' },
      { id: 'ASIKHM001', parent: 'ASIKHM', label: 'Banteay Meanchey' },
      { id: 'ASIKHM002', parent: 'ASIKHM', label: 'Battambang' },
    ];
    const expected = false;
    expect(computeHasSpotlight(items)).toEqual(expected);
  });
  test('should true items length > 8 ', () => {
    const items = [
      { id: 'ASIKHM', label: 'Cambodia' },
      { id: 'ASIKHM001', parent: 'ASIKHM', label: 'Banteay Meanchey' },
      { id: 'ASIKHM002', parent: 'ASIKHM', label: 'Battambang' },
      { id: 'ASIKHM002', parent: 'ASIKHM', label: 'Battambang' },
      { id: 'ASIKHM002', parent: 'ASIKHM', label: 'Battambang' },
      { id: 'ASIKHM002', parent: 'ASIKHM', label: 'Battambang' },
      { id: 'ASIKHM002', parent: 'ASIKHM', label: 'Battambang' },
      { id: 'ASIKHM002', parent: 'ASIKHM', label: 'Battambang' },
      { id: 'ASIKHM002', parent: 'ASIKHM', label: 'Battambang' },
    ];
    const expected = true;
    expect(computeHasSpotlight(items)).toEqual(expected);
  });
  test('should false only 2 childNodes', () => {
    const items = [
      {
        id: 'ASIKHM',
        label: 'Cambodia',
        childNodes: [
          { id: 'ASIKHM001', label: 'Banteay Meanchey' },
          { id: 'ASIKHM002', label: 'Battambang' },
        ],
      },
    ];
    const expected = false;
    expect(computeHasSpotlight(items)).toEqual(expected);
  });
  test('should true childNodes length > 8', () => {
    const items = [
      {
        id: 'ASIKHM',
        label: 'Cambodia',
        childNodes: [
          { id: 'ASIKHM001', label: 'Banteay Meanchey' },
          { id: 'ASIKHM002', label: 'Battambang' },
          { id: 'ASIKHM002', label: 'Battambang' },
          { id: 'ASIKHM002', label: 'Battambang' },
          { id: 'ASIKHM002', label: 'Battambang' },
          { id: 'ASIKHM002', label: 'Battambang' },
          { id: 'ASIKHM002', label: 'Battambang' },
          { id: 'ASIKHM002', label: 'Battambang' },
          { id: 'ASIKHM002', label: 'Battambang' },
        ],
      },
    ];
    const expected = true;
    expect(computeHasSpotlight(items)).toEqual(expected);
  });
  test('should true childNodes length > 8', () => {
    const items = [
      {
        id: 'ASIKHM',
        label: 'Cambodia',
        childNodes: [
          {
            id: 'ASIKHM001',
            label: 'Banteay Meanchey',
            childNodes: [
              { id: 'ASIKHM002', label: 'Battambang' },
              { id: 'ASIKHM002', label: 'Battambang' },
              { id: 'ASIKHM002', label: 'Battambang' },
              { id: 'ASIKHM002', label: 'Battambang' },
              { id: 'ASIKHM002', label: 'Battambang' },
              { id: 'ASIKHM002', label: 'Battambang' },
              { id: 'ASIKHM002', label: 'Battambang' },
              { id: 'ASIKHM002', label: 'Battambang' },
              { id: 'ASIKHM002', label: 'Battambang' },
            ],
          },
        ],
      },
    ];
    const expected = true;
    expect(computeHasSpotlight(items)).toEqual(expected);
  });
});
