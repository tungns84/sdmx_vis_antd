import {
  getSelectedIdsIndexed,
  setSelectedDimensionsValues,
  getOnlyHasDataDimensions,
} from '../';

describe('sdmx lib', () => {
  describe('getSelectedIdsIndexed', () => {
    it('should indexed array of ids', () => {
      const filters = [
        { id: 'id1', values: [{ id: 'v1' }, { id: 'v2', isSelected: true }] },
        { id: 'id2', values: [{ id: 'v2', isSelected: true }, { id: 'v3' }] },
      ];
      expect(getSelectedIdsIndexed([])).toEqual({});
      expect(getSelectedIdsIndexed(filters)).toEqual({
        id1: ['v2'],
        id2: ['v2'],
      });
    });
  });
  describe('setSelectedDimensionsValues', () => {
    it('should set selected item in dimension values', () => {
      const expected = [
        { id: 'id1', values: [{ id: 'v1' }, { id: 'v2', isSelected: true }] },
        {
          id: 'id2',
          values: [
            { id: 'v3', isSelected: true },
            { id: 'v4', isSelected: true },
          ],
        },
        {},
      ];
      const dimensions = [
        { id: 'id1', values: [{ id: 'v1' }, { id: 'v2' }] },
        { id: 'id2', values: [{ id: 'v3' }, { id: 'v4' }] },
        {},
      ];
      expect(setSelectedDimensionsValues('v2.v3+v4.', dimensions)).toEqual(
        expected,
      );
    });
  });
  describe('getOnlyHasDataDimensions', () => {
    it('should set selected item in dimension values', () => {
      const dimensions = [
        { id: 'id1', hasData: true, values: [{ id: 'v2', hasData: true }] },
        { id: 'id2', hasData: false, values: [{ id: 'v3', hasData: false }] },
        {
          id: 'id3',
          hasData: false,
          values: [
            { id: 'v5', hasData: false },
            { id: 'v6', hasData: false },
          ],
        },
      ];
      const expected = [
        { id: 'id1', hasData: true, values: [{ id: 'v2', hasData: true }] },
        {},
        {},
      ];
      expect(getOnlyHasDataDimensions(dimensions)).toEqual(expected);
    });
  });
});
