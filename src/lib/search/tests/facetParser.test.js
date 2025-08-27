import facetParser from '../facetParser';
import valueTreeParser from '../valueTreeParser';

describe('facetParser', () => {
  it('should pass', () => {
    const mockedFacet = [
      'Thème!',
      {
        type: 'tree',
        localized: true,
        buckets: [
          { val: '0|Economy#ECO#', count: 29, order: 2 },
          { val: '0|Employment#EMP#', count: 29, order: 1 },
          { val: '0|Energy#NRG#', count: 29, order: 0 },
          { val: '0|Health#HEA#', count: 55, order: 0 },
          { val: '0|Innovation and Technology#INT#', count: 29 },
          { val: '0|Society#SOC#', count: 29 },
          { val: '1|Education#EDU#|Attainment#ATT#', count: 29 },
          { val: '1|Education#EDU#|Education at a glance#EAG#', count: 29 },
          { val: '1|Education#EDU#|Enrolment#ENRL#', count: 29 },
          { val: '1|Environment#ENV#|Air and Climate#ENV_AC#', count: 29 },
          { val: '1|Environment#ENV#|Forest#ENV_FO#', count: 29 },
          { val: '1|Environment#ENV#|Waste#ENV_WAS#', count: 29 },
          { val: '1|Environment#ENV#|Water#ENV_WAT#', count: 29 },
          { val: '1|Government#GOV#|Taxation#GOV_TAX#', count: 29 },
          { val: '1|Industry#IND#|Tourism#IND_TOUR#', count: 29 },
          {
            val: '2|Government#GOV#|General government#GOV_GG#|Government at a glance#GOV_GAG#',
            count: 29,
          },
          {
            val: '2|Government#GOV#|General government#GOV_GG#|Other government-related#GOV_O#',
            count: 29,
          },
        ],
      },
    ];

    const valueParser = valueTreeParser({ facetId: 'Thème!' });
    const expected = {
      id: 'Thème!',
      label: 'Thème!',
      hasPath: true,
      count: 0,
      values: [
        valueParser({
          val: '1|Environment#ENV#|Air and Climate#ENV_AC#',
          count: 29,
        }),
        valueParser({ val: '1|Education#EDU#|Attainment#ATT#', count: 29 }),
        valueParser({ val: '0|Education#EDU#' }),
        valueParser({
          val: '1|Education#EDU#|Education at a glance#EAG#',
          count: 29,
        }),
        valueParser({ val: '0|Energy#NRG#', count: 29, order: 0 }),
        valueParser({ val: '1|Education#EDU#|Enrolment#ENRL#', count: 29 }),
        valueParser({ val: '0|Environment#ENV#' }),
        valueParser({ val: '1|Environment#ENV#|Forest#ENV_FO#', count: 29 }),
        valueParser({ val: '1|Government#GOV#|General government#GOV_GG#' }),
        valueParser({ val: '0|Government#GOV#' }),
        valueParser({
          val: '2|Government#GOV#|General government#GOV_GG#|Government at a glance#GOV_GAG#',
          count: 29,
        }),
        valueParser({ val: '0|Health#HEA#', count: 55, order: 0 }),
        valueParser({ val: '0|Industry#IND#' }),
        valueParser({ val: '0|Innovation and Technology#INT#', count: 29 }),
        valueParser({
          val: '2|Government#GOV#|General government#GOV_GG#|Other government-related#GOV_O#',
          count: 29,
        }),
        valueParser({ val: '0|Society#SOC#', count: 29 }),
        valueParser({ val: '1|Government#GOV#|Taxation#GOV_TAX#', count: 29 }),
        valueParser({ val: '1|Industry#IND#|Tourism#IND_TOUR#', count: 29 }),
        valueParser({ val: '1|Environment#ENV#|Waste#ENV_WAS#', count: 29 }),
        valueParser({ val: '1|Environment#ENV#|Water#ENV_WAT#', count: 29 }),
        valueParser({ val: '0|Employment#EMP#', count: 29, order: 1 }),
        valueParser({ val: '0|Economy#ECO#', count: 29, order: 2 }),
      ],
    };

    expect(facetParser({})(mockedFacet)).toEqual(expected);
  });

  it('should handle partial tree/path', () => {
    const mockedFacet = [
      'Thème!',
      {
        type: 'tree',
        localized: true,
        buckets: [
          { val: '0|Environment#ENV#', count: 29 },
          { val: '1|Environment#ENV#|Water#ENV_WAT#', count: 29 },
          { val: '0|Energy#NRG#', count: 29 },
          { val: '1|Education#EDU#|Attainment#ATT#', count: 29 },
          {
            val: '2|Government#GOV#|General government#GOV_GG#|Government at a glance#GOV_GAG#',
            count: 29,
          },
        ],
      },
    ];

    const valueParser = valueTreeParser({ facetId: 'Thème!' });

    const expected = {
      id: 'Thème!',
      label: 'Thème!',
      hasPath: true,
      count: 0,
      values: [
        valueParser({ val: '1|Education#EDU#|Attainment#ATT#', count: 29 }),
        valueParser({ val: '0|Education#EDU#' }),
        valueParser({ val: '0|Energy#NRG#', count: 29 }),
        valueParser({ val: '0|Environment#ENV#', count: 29 }),
        valueParser({ val: '1|Government#GOV#|General government#GOV_GG#' }),
        valueParser({ val: '0|Government#GOV#' }),
        valueParser({
          val: '2|Government#GOV#|General government#GOV_GG#|Government at a glance#GOV_GAG#',
          count: 29,
        }),
        valueParser({ val: '1|Environment#ENV#|Water#ENV_WAT#', count: 29 }),
      ],
    };

    expect(facetParser({})(mockedFacet)).toEqual(expected);
  });
});
