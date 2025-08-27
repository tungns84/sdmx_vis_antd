import {
  getSdmxPeriod,
  getIntervalPeriod,
  getSubstructedDate,
} from '../frequency';

vi.mock('../../settings', () => ({
  defaultFrequency: 'A',
  sdmxPeriodBoundaries: ['2017', '2020'],
}));

describe('Frequency', () => {
  test('is valid Date', () => {
    expect(getSdmxPeriod('A')(new Date('2018'))).toEqual('2018');
    expect(getSdmxPeriod('S')(new Date('2018 01 01'))).toEqual('2018-S1');
    expect(getSdmxPeriod('Q')(new Date('2018 01 01'))).toEqual('2018-Q1');
    expect(getSdmxPeriod('M')(new Date('2018 01 01'))).toEqual('2018-01');
    expect(getSdmxPeriod('W')(new Date('2018 01 01'))).toEqual('2018-W01');
    expect(getSdmxPeriod('B')(new Date('2018 01 01'))).toEqual('2018-W01');
    expect(getSdmxPeriod('D')(new Date('2018 01 01'))).toEqual('2018-01-01');
    expect(getSdmxPeriod('H')(new Date('2018 01 01'))).toEqual(
      '2018-01-01T00:00:00',
    );
    expect(getSdmxPeriod('N')(new Date('2018 01 01'))).toEqual(
      '2018-01-01T00:00:00',
    );
  });
  test('counter of period following the frequency', () => {
    const boundaries = [new Date('2017'), new Date('2020')];
    const dates1 = [new Date('2018'), new Date('2019')];
    // const dates2 = [undefined, new Date('2019')];

    expect(getIntervalPeriod(boundaries)('A', dates1)).toEqual([2, 4]);
    expect(getIntervalPeriod(boundaries)('S', dates1)).toEqual([3, 7]);
    expect(getIntervalPeriod(boundaries)('Q', dates1)).toEqual([5, 13]);
    expect(getIntervalPeriod(boundaries)('W', dates1)).toEqual([53, 157]);
    expect(getIntervalPeriod(boundaries)(undefined, dates1)).toEqual([2, 4]);
    //expect(Freq.getIntervalPeriod(boundaries)(undefined, dates2)).toEqual([3, 4]);
    expect(
      getIntervalPeriod(boundaries)(undefined, [undefined, undefined]),
    ).toEqual([0, 4]);
  });
  test('it should return undefined value', () => {
    expect(
      getSubstructedDate(new Date('2018'), undefined, 'A'),
    ).toBeUndefined();
    expect(getSubstructedDate(undefined, 2, 'A')).toBeUndefined();
    expect(getSubstructedDate(undefined, undefined, 'A')).toBeUndefined();
  });
});
