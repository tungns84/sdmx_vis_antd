import * as R from 'ramda';
import { fromStateToSearch, fromSearchToState } from '../router';

describe('utils of router ', () => {
  const state = {
    tenant: 'dev',
    facet: 'eco',
    constraints: {
      '1bee525958b5c71ff731b7badbaa861f': {
        facetId: 'cou',
        constraintId: 'fra',
      },
      ae3b7693c6547dceacf02b9f84e84640: { facetId: 'ind', constraintId: 'yma' },
    },
    dataflow: {
      datasourceId: '1',
      dataflowId: '2',
      agencyId: 'rp',
      version: '1.0',
      prop: 3,
    },
    layout: {
      sections: ['REF_AREA'],
      rows: ['TIME_PERIOD'],
      header: ['AGE'],
    },
  };

  const search =
    'tenant=dev&fc=eco&fs[0]=cou%2Cfra&fs[1]=ind%2Cyma&df[ds]=1&df[id]=2&df[ag]=rp&df[vs]=1.0&ly[rs]=REF_AREA&ly[rw]=TIME_PERIOD&ly[cl]=AGE';

  it('should process a state into a search for browser history', () => {
    expect(fromStateToSearch(state)).toEqual(search);
  });

  it('should process a search for browser history into a state', () => {
    expect(fromSearchToState(search)).toEqual({
      ...state,
      dataflow: R.omit(['prop'], state.dataflow),
    });
  });

  it('should handle alternative shortcut for layout', () => {
    expect(
      fromSearchToState('lt[rs]=REF_AREA&lt[rw]=TIME_PERIOD&lt[cl]=AGE'),
    ).toEqual({
      layout: R.prop('layout')(state),
    });
  });

  it('should handle alternative + current shortcut for layout (lt and ly)', () => {
    // this use case appear only by manipulate the url itself
    // lt will overide ly
    expect(
      fromSearchToState('ly[rs]=REF_AREA&ly[rw]=TIME_PERIOD&lt[cl]=AGE'),
    ).toEqual({
      layout: {
        header: ['AGE'],
      },
    });
  });

  it('should process a search for browser history into a state with a facet value with an escaped comma', () => {
    const search =
      'fs[0]=Topic%2C0%7CRegions%252C%20cities%20and%20local%20areas%23GEO%23';
    expect(fromSearchToState(search)).toEqual({
      constraints: {
        '02f9ad05881a2f50ff8af497cdf434ba': {
          facetId: 'Topic',
          constraintId: '0|Regions, cities and local areas#GEO#',
        },
      },
    });
  });

  it('layout not in array', () => {
    expect(
      fromStateToSearch({
        layout: {
          sections: 'REF_AREA',
          rows: 'TIME_PERIOD',
          header: 'AGE',
        },
      }),
    ).toEqual('ly[rs]=REF_AREA&ly[rw]=TIME_PERIOD&ly[cl]=AGE');
  });

  it('should escape a comma in a constraint value', () => {
    expect(
      fromStateToSearch({
        constraints: {
          '02f9ad05881a2f50ff8af497cdf434ba': {
            facetId: 'Topic',
            constraintId: '0|Regions%2C cities and local areas#GEO#',
          },
        },
      }),
    ).toEqual(
      'fs[0]=Topic%2C0%7CRegions%252C%20cities%20and%20local%20areas%23GEO%23',
    );
  });
});
