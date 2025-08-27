import searchParser from '../searchParser';
import enFixture from './en_fixture.json';

describe('searchParser', () => {
  it('should parse empty response', () => {
    const dataflows = [];
    const facets = {};
    const highlighting = {};
    const numFound = 0;
    expect(
      searchParser()({ dataflows, facets, highlighting, numFound }),
    ).toEqual({
      dataflows,
      facets: [],
      searchResultNb: numFound,
    });
    expect(() =>
      searchParser()({ dataflows, facets, highlighting, numFound }),
    ).not.toThrowError();
  });

  it('should parse en response without error', () => {
    expect(() => searchParser()(enFixture)).not.toThrowError();
  });
});
