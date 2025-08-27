import { formatFlags } from '../utils';
import { rules2 } from '@sis-cc/dotstatsuite-components';

describe('export excel formatFlags tests', () => {
  test('simple case with combination', () => {
    const labelAccessor = rules2.getTableLabelAccessor('label');
    expect(
      formatFlags(labelAccessor)([
        {
          id: 'fl1',
          name: 'first entry',
          values: [
            { id: 'v1', name: 'first value' },
            { id: 'v2', name: 'second value' },
            { id: 'v3', name: 'third value' },
          ],
        },
        { id: 'fl2', name: 'second entry', value: { id: 'v', name: 'value' } },
      ]),
    ).toBe(
      'first entry: first value, second value, third value\nsecond entry: value',
    );
  });
  test('label Accessor', () => {
    const labelAccessor = rules2.getTableLabelAccessor('code');
    expect(
      formatFlags(labelAccessor)([
        {
          id: 'fl1',
          name: 'first entry',
          values: [
            { id: 'v1', name: 'first value' },
            { id: 'v2', name: 'second value' },
            { id: 'v3', name: 'third value' },
          ],
        },
        { id: 'fl2', name: 'second entry', value: { id: 'v', name: 'value' } },
      ]),
    ).toBe('fl1: v1, v2, v3\nfl2: v');
  });
  test('with sub flags', () => {
    const labelAccessor = rules2.getTableLabelAccessor('label');
    expect(
      formatFlags(labelAccessor)([
        {
          id: 'fl1',
          name: 'first entry',
          value: { id: 'v', name: 'value' },
          sub: [
            {
              id: 'sub',
              name: 'sub entry',
              values: [
                { id: 'v1', name: 'first value' },
                { id: 'v2', name: 'second value' },
                { id: 'v3', name: 'third value' },
              ],
            },
          ],
        },
        { id: 'fl2', name: 'second entry', value: { id: 'v', name: 'value' } },
      ]),
    ).toBe(
      'first entry: value\nsub entry: first value, second value, third value\nsecond entry: value',
    );
  });
});
