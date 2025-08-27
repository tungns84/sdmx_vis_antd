import * as R from 'ramda';
import {
  ASC,
  DESC,
  sortByIndex,
  sortByLabel,
  sortByNumberId,
  sortByProp,
  sortByOrderAndLabel,
} from '../sort';

const sampleData = [
  { index: 2, label: 'Banana' },
  { index: 1, label: 'Apple' },
  { index: 3, label: 'Cherry' },
];

const dataWithSpecialChars = [
  { index: 3, label: 'Banana' },
  { index: 2, label: 'Äpple' },
  { index: 1, label: 'Örange' },
];

const dataWithIds = [{ id: 3 }, { id: 9 }, { id: 1 }];
const dataWithIdsAsStr = [{ id: '3' }, { id: '12' }, { id: '1' }];

describe('sortByIndex', () => {
  test('should sort objects by index in ascending order', () => {
    const result = sortByIndex(sampleData);
    expect(result).toEqual([
      { index: 1, label: 'Apple' },
      { index: 2, label: 'Banana' },
      { index: 3, label: 'Cherry' },
    ]);
  });
});

describe('sortByLabel', () => {
  test('should sort objects by label in ascending natural order (default)', () => {
    const result = sortByLabel()(sampleData);
    expect(result).toEqual([
      { index: 1, label: 'Apple' },
      { index: 2, label: 'Banana' },
      { index: 3, label: 'Cherry' },
    ]);
  });

  test('should sort objects by label in descending natural order', () => {
    const result = sortByLabel('en', DESC)(sampleData);
    expect(result).toEqual([
      { index: 3, label: 'Cherry' },
      { index: 2, label: 'Banana' },
      { index: 1, label: 'Apple' },
    ]);
  });

  test('should sort correctly with sv locale where ä is after b', () => {
    const result = sortByLabel('sv', ASC)(dataWithSpecialChars);
    expect(result).toEqual([
      { index: 3, label: 'Banana' },
      { index: 2, label: 'Äpple' },
      { index: 1, label: 'Örange' },
    ]);
  });

  test('should sort correctly with de locale where ä is before z', () => {
    const result = sortByLabel('de', ASC)(dataWithSpecialChars);
    expect(result).toEqual([
      { index: 2, label: 'Äpple' },
      { index: 3, label: 'Banana' },
      { index: 1, label: 'Örange' },
    ]);
  });

  test('should sort correctly with fr locale with accents and different cases', () => {
    const data = [
      { label: 'réservé' },
      { label: 'Premier' },
      { label: 'Cliché' },
      { label: 'communiqué' },
      { label: 'café' },
      { label: 'Adieu' },
    ];
    const expected = [
      { label: 'Adieu' },
      { label: 'café' },
      { label: 'Cliché' },
      { label: 'communiqué' },
      { label: 'Premier' },
      { label: 'réservé' },
    ];
    expect(sortByLabel('fr', ASC)(data)).toEqual(expected);
    expect(sortByLabel('fr', DESC)(data)).toEqual(R.reverse(expected));
  });
});

describe('sortByNumberId', () => {
  test('should sort id in ascending order', () => {
    const result = sortByNumberId()(dataWithIds);
    expect(result).toEqual([{ id: 1 }, { id: 3 }, { id: 9 }]);
  });

  test('should sort string id as string in descending order', () => {
    const result = sortByProp('id', DESC)(dataWithIdsAsStr);
    expect(result).toEqual([{ id: '1' }, { id: '12' }, { id: '3' }]);
  });

  test('should sort string id as number in ascending & descending order', () => {
    expect(sortByNumberId()(dataWithIdsAsStr)).toEqual([
      { id: '1' },
      { id: '3' },
      { id: '12' },
    ]);
    expect(sortByNumberId(DESC)(dataWithIdsAsStr)).toEqual([
      { id: '12' },
      { id: '3' },
      { id: '1' },
    ]);
  });
});

describe('sortByOrderAndLabel', () => {
  it('should sort by order in ascending and label in natural order', () => {
    const input = [
      { order: 2, label: 'Banana' },
      { order: 1, label: 'Apple' },
      { order: 3, label: 'Orange' },
    ];

    const sorted = sortByOrderAndLabel('en')(input);

    expect(sorted).toEqual([
      { order: 1, label: 'Apple' },
      { order: 2, label: 'Banana' },
      { order: 3, label: 'Orange' },
    ]);
  });

  it('should sort by order first, and by label when order is the same', () => {
    const input = [
      { order: 1, label: 'Banana' },
      { order: 1, label: 'Apple' },
      { order: 2, label: 'Orange' },
    ];

    const sorted = sortByOrderAndLabel('en')(input);

    expect(sorted).toEqual([
      { order: 1, label: 'Apple' },
      { order: 1, label: 'Banana' },
      { order: 2, label: 'Orange' },
    ]);
  });

  it('should handle empty input', () => {
    const input = [];

    const sorted = sortByOrderAndLabel('en')(input);

    expect(sorted).toEqual([]);
  });

  it('should handle different languages for natural sorting (e.g., German umlaut)', () => {
    const input = [
      { order: 1, label: 'Äpfel' },
      { order: 1, label: 'Apfel' },
    ];

    const sorted = sortByOrderAndLabel('de')(input);

    expect(sorted).toEqual([
      { order: 1, label: 'Apfel' },
      { order: 1, label: 'Äpfel' },
    ]);
  });

  it('should handle mixed case labels correctly (natural sorting)', () => {
    const input = [
      { order: 1, label: 'apple' },
      { order: 1, label: 'Apple' },
    ];

    const sorted = sortByOrderAndLabel('en')(input);

    expect(sorted).toEqual([
      { order: 1, label: 'apple' },
      { order: 1, label: 'Apple' },
    ]);
  });

  it('should work with numeric labels in natural order', () => {
    const input = [
      { order: 1, label: '10' },
      { order: 1, label: '2' },
      { order: 1, label: '1' },
    ];

    const sorted = sortByOrderAndLabel('en')(input);

    expect(sorted).toEqual([
      { order: 1, label: '1' },
      { order: 1, label: '2' },
      { order: 1, label: '10' },
    ]);
  });
});
