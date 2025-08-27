import {
  getDataDimensions,
  getVisDataDimensions,
  getVisActionId,
  getIsFull,
} from '../.';

const data = (observation) => ({
  data: { structure: { dimensions: { observation } } },
});
describe('selectors | vis', () => {
  describe('getDataDimensions', () => {
    test('no crash with partial element', () => {
      expect(getDataDimensions()({})).toEqual([]);
      expect(getDataDimensions()({ sdmx: data([{}]) })).toEqual([
        { index: 0, values: [] },
      ]);
      expect(
        getDataDimensions()({ sdmx: data([{ values: [{}, {}] }]) }),
      ).toEqual([{ index: 0, values: [{ index: 0 }, { index: 1 }] }]);
    });
  });
  describe('getVisDataDimensions', () => {
    test('separate one values and many values in two groups', () => {
      const state = {
        sdmx: data([
          { id: 'test1', values: [{}, {}] },
          { id: 'test2', values: [{}] },
        ]),
      };
      const expected = {
        many: {
          test1: {
            id: 'test1',
            index: 0,
            values: [{ index: 0 }, { index: 1 }],
          },
        },
        one: { test2: { id: 'test2', index: 1, values: [{ index: 0 }] } },
      };
      expect(getVisDataDimensions()(state)).toEqual(expected);
    });
  });
  describe('getVisActionId', () => {
    test('basic ouput', () => {
      expect(getVisActionId()({ vis: { actionId: 1 } })).toEqual(1);
      expect(getVisActionId()({ vis: {} })).toEqual(undefined);
    });
  });
  describe('getIsFull', () => {
    test('basic ouput', () => {
      expect(getIsFull()({ vis: { isFull: 1 } })).toEqual(1);
      expect(getIsFull()({ vis: {} })).toEqual(undefined);
    });
  });
});
