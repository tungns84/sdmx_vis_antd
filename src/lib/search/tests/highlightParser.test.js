import highlightParser from '../highlightParser';

describe('highlightParser', () => {
  it('should handle flat case', () => {
    expect(
      highlightParser('<mark>industrial</mark> machinery and equipment#C332#'),
    ).toEqual({
      label: '<mark>industrial</mark> machinery and equipment',
      valueId: 'C332',
    });
  });
  it('should handle truncated flat case', () => {
    expect(
      highlightParser('<mark>industrial</mark> machinery and equipment'),
    ).toEqual({
      label: '<mark>industrial</mark> machinery and equipment',
      valueId: undefined,
    });
  });
  it('should handle tree case', () => {
    expect(
      highlightParser(
        '0|Percentage of employment in <mark>industry</mark>#EMP_PERC_IND#',
      ),
    ).toEqual({
      label: 'Percentage of employment in <mark>industry</mark>',
      valueId: 'EMP_PERC_IND',
    });
  });
  it('should handle deep tree case', () => {
    expect(
      highlightParser('3|Y4lla#Y1#|Y5lla#Y2#|Y6 <mark>lla</mark> yalla#Y3#'),
    ).toEqual({
      label: 'Y4lla > Y5lla > Y6 <mark>lla</mark> yalla',
      valueId: 'Y3',
    });
  });
  it('should handle truncated tree case', () => {
    expect(
      highlightParser('3|Y4lla#Y1#|Y5lla#Y2#|Y6 <mark>lla</mark>'),
    ).toEqual({
      label: 'Y4lla > Y5lla > Y6 <mark>lla</mark>',
      valueId: undefined,
    });
  });
});
