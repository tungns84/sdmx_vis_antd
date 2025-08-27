import categoriesParser, { pathParser } from '../categoriesParser';

describe('categories parser', () => {
  it('should parse path', () => {
    const path = '1|Non-OECD economies#WXOECD#|Argentina#ARG#';
    const expected = ['Non-OECD economies', 'Argentina'];
    expect(pathParser(path)).toEqual(expected);
  });

  it('should parse categories', () => {
    const values = [
      '0|United Kingdom#GBR#',
      '1|Non-OECD economies#WXOECD#|Argentina#ARG#',
      '0|Italy#ITA#',
      '1|Italy#ITA#|Piemonte#PMT#',
      '2|Italy#ITA#|Piemonte#PMT#|Torino#TRO#',
    ];
    const expected = [
      'United Kingdom',
      ['Non-OECD economies', 'Argentina'],
      ['Italy', 'Piemonte', 'Torino'],
    ];
    expect(categoriesParser(values)).toEqual(expected);
  });
});
