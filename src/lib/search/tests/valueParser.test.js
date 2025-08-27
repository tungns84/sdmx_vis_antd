import valueParser from '../valueParser';
import md5 from 'md5';

describe('valueParser', () => {
  it('should pass, no id', () => {
    expect(
      valueParser({ facetId: 1 })({ val: 'test', count: 10, order: 10200 }),
    ).toEqual({
      id: 'test',
      code: '',
      label: '',
      count: 10,
      isDisabled: false,
      isSelected: false,
      svgPath: undefined,
      order: 10200,
    });
  });

  const value = {
    val: '0|Economy#ECO#',
    label: 'Economy#ECO#',
    count: 10,
    order: 10200,
  };

  it('should pass, no constraint', () => {
    expect(valueParser({ facetId: 1 })(value)).toEqual({
      id: value.val,
      code: 'ECO',
      label: 'Economy',
      count: value.count,
      isDisabled: false,
      isSelected: false,
      svgPath: undefined,
      order: 10200,
    });
  });

  it('should pass and be selected', () => {
    expect(
      valueParser({
        facetId: 1,
        constraints: { [md5(`${1}${value.val}`)]: 111 },
      })(value),
    ).toEqual({
      id: value.val,
      code: 'ECO',
      label: 'Economy',
      count: value.count,
      isDisabled: false,
      isSelected: true,
      svgPath: undefined,
      order: 10200,
    });
  });

  it('should pass, with an icon', () => {
    expect(
      valueParser({
        facetId: '1',
        config: { valueIcons: { 1: { ECO: 'icon' } } },
      })(value),
    ).toEqual({
      id: value.val,
      code: 'ECO',
      label: 'Economy',
      count: value.count,
      isSelected: false,
      isDisabled: false,
      svgPath: 'icon',
      order: 10200,
    });
  });

  it('should pass, count at 0, order at null, disabled', () => {
    expect(
      valueParser({
        facetId: '1',
        config: { valueIcons: { 1: { ECO: 'icon' } } },
      })({
        ...value,
        count: 0,
        order: null,
      }),
    ).toEqual({
      id: value.val,
      code: 'ECO',
      label: 'Economy',
      count: null,
      isSelected: false,
      isDisabled: true,
      svgPath: 'icon',
      order: 0,
    });
  });
});
