import { makeTree } from '../';

describe('DE - utils - makeTree', () => {
  test('default output', () => {
    const items = [
      { id: 'ASIKHM', label: 'Cambodia' },
      { id: 'ASIKHM001', parent: 'ASIKHM', label: 'Banteay Meanchey' },
      { id: 'ASIKHM002', parent: 'ASIKHM', label: 'Battambang' },
    ];
    const expected = [
      {
        id: 'ASIKHM',
        label: 'Cambodia',
        childNodes: [
          { id: 'ASIKHM001', label: 'Banteay Meanchey' },
          { id: 'ASIKHM002', label: 'Battambang' },
        ],
      },
    ];
    expect(makeTree(items)).toEqual(expected);
  });
  test('should do work like same that if there has no parent', () => {
    const items = [
      { id: 'ASIKHM', label: 'Cambodia' },
      { id: 'ASIKHM001', parent: 'ASIKHM', label: 'Banteay Meanchey' },
      { id: 'ASIKHM002', parent: undefined, label: 'Battambang' },
    ];
    const expected = [
      {
        id: 'ASIKHM',
        label: 'Cambodia',
        childNodes: [{ id: 'ASIKHM001', label: 'Banteay Meanchey' }],
      },
      { id: 'ASIKHM002', label: 'Battambang' },
    ];
    expect(makeTree(items)).toEqual(expected);
  });
});
