import * as R from 'ramda';
import { getDataDimensions, getVisDataDimensions } from '../.';
import {
  getPeriod,
  getDatesBoundaries,
  getDimensionsWithDataQuerySelection,
} from '../sdmx';
import { dateWithoutTZ } from '../../utils/date';

vi.mock('../../lib/settings', () => {
  const removeTZ = (date, minutes) => {
    return new Date(date.getTime() + minutes * 60000);
  };
  const startSdmxPeriodBoundaries = new Date('1970');
  return {
    defaultFrequency: 'A',
    sdmxPeriod: ['2010', '2015-12-31T23:59:59'],
    sdmxPeriodBoundaries: [
      removeTZ(
        startSdmxPeriodBoundaries,
        startSdmxPeriodBoundaries.getTimezoneOffset(),
      ),
      new Date('2050-12-31T23:59:59.999'),
    ],
    theme: { visFont: 'totot' },
    i18n: { localeId: 'en' },
  };
});

describe('selectors | for data and structure', () => {
  describe('getDataDimensions', () => {
    test("no crash if data doesn't exist", () => {
      expect(getDataDimensions()({})).toEqual([]);
    });
    test("no crash if values doesn't have values", () => {
      const data = { structure: { dimensions: { observation: [{}] } } };
      const expected = [{ index: 0, values: [] }];
      expect(getDataDimensions()({ sdmx: { data } })).toEqual(expected);
    });
    test('add index to dimensions', () => {
      const data = {
        structure: { dimensions: { observation: [{ values: [{}, {}] }] } },
      };
      const expected = [{ index: 0, values: [{ index: 0 }, { index: 1 }] }];
      expect(getDataDimensions()({ sdmx: { data } })).toEqual(expected);
    });
  });
  describe('getVisDataDimensions', () => {
    test('separate one values and many values in two groups', () => {
      const data = {
        structure: {
          dimensions: {
            observation: [
              { id: 'test1', values: [{}, {}] },
              { id: 'test2', values: [{}] },
            ],
          },
        },
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
      expect(getVisDataDimensions()({ sdmx: { data } })).toEqual(expected);
    });
  });
  describe('getPeriod', () => {
    it('should fit to boundaries', () => {
      const state = (props) => ({
        sdmx: {
          frequencyDimension: { index: 0 },
          timePeriodArtefact: {
            timePeriodBoundaries: R.propOr(
              [undefined, undefined],
              'tPB',
            )(props),
          },
        },
        router: {
          location: {
            state: {
              frequency: R.propOr('A', 'freq')(props),
              period: R.prop('period', props),
              hasDataAvailability: true,
            },
          },
        },
      });
      // without period
      const tPB1 = [new Date('1995'), new Date('1995')];
      const tPB2 = [new Date('2000'), new Date('2050')];
      const expected = [
        dateWithoutTZ(new Date('2011')),
        dateWithoutTZ(new Date('2013')),
      ];
      expect(getPeriod(state({ tPB: tPB1 }))).toEqual([undefined, undefined]);
      expect(getPeriod(state({ tPB: tPB1, period: ['2011', '2013'] }))).toEqual(
        tPB1,
      );
      expect(getPeriod(state({ tPB: tPB2, period: ['2011', '2013'] }))).toEqual(
        expected,
      );
    });
  });
  describe('getPeriodBoundaries', () => {
    it('should fallback to sdmxBoundaries if needed', () => {
      const state = (timePeriodBoundaries) => ({
        sdmx: { timePeriodArtefact: { timePeriodBoundaries } },
        router: {
          location: {
            state: {
              dataAvailability: false,
            },
          },
        },
      });
      expect(getDatesBoundaries(state(['2018', '2020']))).toEqual([
        '2018',
        '2020',
      ]);
      const dates = [
        dateWithoutTZ(new Date('1990-01-01T00:00:00.000Z')),
        dateWithoutTZ(new Date('2000-01-01T00:00:00.000Z')),
      ];
      expect(getDatesBoundaries(state(dates))).toEqual(dates);
    });
  });
  describe('getDimensionsWithDataQuerySelection', () => {
    test('use cases', () => {
      const state = (dimensions = [], dataquery) => ({
        sdmx: { dimensions },
        router: {
          location: {
            state: {
              dataquery,
            },
          },
        },
      });
      expect(
        getDimensionsWithDataQuerySelection(state(), {
          automatedSelections: {},
        }),
      ).toEqual([]);
      expect(
        getDimensionsWithDataQuerySelection(
          state([{ id: 1, display: true, values: [{}, {}] }, { id: 2 }]),
          { automatedSelections: {} },
        ),
      ).toEqual([{ id: 1, display: true, values: [{}, {}] }]);
      expect(
        getDimensionsWithDataQuerySelection(state([{}, {}], '.A'), {
          automatedSelections: {},
        }),
      ).toEqual([]);
    });
  });
});
