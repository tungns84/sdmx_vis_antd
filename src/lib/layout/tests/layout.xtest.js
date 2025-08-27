import { getTableConfigLayout } from '../';

describe('DE - lib - layout', () => {
  describe('getTableConfigLayout', () => {
    const layout = {
      header: [
        { id: 'D0', values: [{ id: 'v0' }, { id: 'v1' }, { id: 'v2' }] },
      ],
      sections: [{ id: 'D1', values: [{ id: 'v0' }, { id: 'v1' }] }],
      rows: [
        {
          id: 'D2',
          role: 'TIME_PERIOD',
          values: [{ id: 'v0' }, { id: 'v1' }, { id: 'v2' }],
        },
        {
          id: 'D3',
          values: [
            { id: 'v0' },
            { id: 'v1' },
            { id: 'v2' },
            { id: 'v3' },
            { id: 'v4' },
            { id: 'v5' },
          ],
        },
      ],
    };

    it('basic test', () => {
      expect(getTableConfigLayout(layout)).toEqual({
        items: [
          {
            id: 'D0',
            isTimePeriod: false,
            count: 3,
            values: [{ id: 'v0' }, { id: 'v1' }, { id: 'v2' }],
          },
          {
            id: 'D1',
            count: 2,
            isTimePeriod: false,
            values: [{ id: 'v0' }, { id: 'v1' }],
          },
          {
            id: 'D2',
            isTimePeriod: true,
            role: 'TIME_PERIOD',
            count: 3,
            values: [{ id: 'v0' }, { id: 'v1' }, { id: 'v2' }],
          },
          {
            id: 'D3',
            isTimePeriod: false,
            count: 6,
            values: [
              { id: 'v0' },
              { id: 'v1' },
              { id: 'v2' },
              { id: 'v3' },
              { id: 'v4' },
              { id: 'v5' },
            ],
          },
        ],
        layout: {
          header: ['D0'],
          sections: ['D1'],
          rows: ['D2', 'D3'],
        },
      });
    });
  });
});
