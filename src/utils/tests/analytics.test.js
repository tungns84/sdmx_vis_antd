import { joinDataflowIds } from '../analytics';

describe('joinDataflowIds', () => {
  test('remove all @ in the string', () => {
    const props = {
      datasourceId: 'bar@bar@bar',
      dataflowId: 'bar@',
      agencyId: '@bar@bar@bar',
      version: 'bar@bar@bar@',
      foo: 'bar',
    };
    const expected =
      'bar[at]bar[at]bar/bar[at]/[at]bar[at]bar[at]bar/bar[at]bar[at]bar[at]';
    expect(joinDataflowIds(props)).toEqual(expected);
  });
});
