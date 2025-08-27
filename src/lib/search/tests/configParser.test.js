import * as R from 'ramda';
import configParser from '../configParser';
import facetsParser from '../facetsParser';
import C from '../constants';

const mockedFacets = {
  'Thème!': {
    type: 'tree',
    localized: true,
    buckets: [{ val: '0|Economy#ECO#', count: 9 }],
  },
  Countries: {
    type: 'tree',
    localized: true,
    buckets: [{ val: '0|Finland#FIN#', count: 19 }],
  },
  [C.DATASOURCE_ID]: {
    type: 'tree',
    localized: true,
    buckets: [{ val: '0|Government#GOV#', count: 29 }],
  },
};

const defaultParserArgs = { config: { localeId: 'en' } };

describe('configParser', () => {
  it('no facet & no restriction', () => {
    const expected = { locale: 'en', facets: [] };
    expect(expected).toEqual(
      configParser(defaultParserArgs)({ locale: 'en', facets: {} }),
    );
  });

  it('facets & no restriction', () => {
    const expected = { locale: 'en', facets: facetsParser()(mockedFacets) };
    expect(expected).toEqual(
      configParser(defaultParserArgs)({ locale: 'en', facets: mockedFacets }),
    );
  });

  it('with facets & restriction', () => {
    const expectedFacets = R.pick(['Thème!'], mockedFacets);
    const expected = { locale: 'en', facets: facetsParser()(expectedFacets) };
    const restriction = { ...defaultParserArgs, facetIds: ['Thème!'] };
    expect(expected).toEqual(
      configParser(restriction)({ locale: 'en', facets: mockedFacets }),
    );
  });

  it('with facets & exception restriction (datasource)', () => {
    const expectedFacets = R.pick([C.DATASOURCE_ID], mockedFacets);
    const expected = { locale: 'en', facets: facetsParser()(expectedFacets) };
    const restriction = { ...defaultParserArgs, facetIds: [C.DATASOURCE_ID] };
    expect(expected).toEqual(
      configParser(restriction)({ locale: 'en', facets: mockedFacets }),
    );
  });
});
