import { useSearchFacets } from '../useSearchFacets';
import facets from './facets.json';
import expandedFacets from './expandedFacets.json';
import hiddenFacets from './hiddenFacets.json';
import searchConfig from './searchConfig.json';
import { customRenderHook } from '../../tests/snapshotTests/mockProviders';

describe('useSearchFacets test suite', () => {
  it('should pass for empty/null facets', (done) => {
    const { result } = customRenderHook(() =>
      useSearchFacets(null, 10, searchConfig, 10),
    );
    expect(result.current).toEqual([[], []]);
    done();
  });

  it('should pass for minimal usecase', (done) => {
    const minimalFacets = [
      {
        id: 'datasourceId',
        label: 'datasourceId',
        values: [
          {
            id: 'ds:qa:stable',
            code: '',
            label: 'ds:qa:stable',
            order: 0,
            count: 13,
            isDisabled: false,
            isSelected: false,
            parentId: null,
            level: null,
            path: null,
          },
        ],
        count: 0,
        hasPath: true,
        isPinned: true,
        index: 0,
      },
      {
        id: 'Frequency of observation',
        label: 'Frequency of observation',
        values: [
          {
            id: '0|Quarterly#Q#',
            code: 'Q',
            label: 'Quarterly',
            order: 0,
            count: 1,
            isDisabled: false,
            isSelected: false,
            parentId: null,
            level: 0,
            path: null,
          },
        ],
        count: 0,
        hasPath: true,
      },
    ];
    const { result } = customRenderHook(() =>
      useSearchFacets(minimalFacets, 10, searchConfig, 1),
    );
    expect(result.current).toEqual([[minimalFacets[0]], [minimalFacets[1]]]);
    done();
  });

  it('should pass for cruise usecase', (done) => {
    const { result } = customRenderHook(() =>
      useSearchFacets(facets, 10, searchConfig, 6),
    );
    expect(result.current).toEqual([expandedFacets, hiddenFacets]);
    done();
  });
});
