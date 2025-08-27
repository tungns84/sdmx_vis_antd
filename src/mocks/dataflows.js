export const dataflow = {
  id: 'OECD:MOCK(1.0)',
  title: 'mock',
  description:
    'dataflow with uri bound to structure mock and configuration spaces to test complete flow, http://dotstatcor-dev2.main.oecd.org/NsiWebserviceDisseminationExternal/rest/data/OECD,MOCK,1.0/.EUR...',
  lastUpdated: 'today',
  topics: ['mock', 'smoke', 'fake'],
  uri: 'http://dotstatcor-dev1.main.oecd.org/NsiWebserviceDissemination/rest/data/OECD,MOCK,1.0/.EUR...E+R',
  href: 'http://dotstatcor-dev1.main.oecd.org/NsiWebserviceDissemination/rest/data/OECD,MOCK,1.0/.EUR...E+R',
  index: -1,
};

export default [
  {
    id: 'OECD:POPULATION(1.0)',
    title:
      'Population broken down by country and sex for various indicators. (POPULATION)',
    description:
      'Population broken down by country and sex for various indicators.',
    lastUpdated: '2017-12-11 13:34:43',
    topics: ['Demography and population', 'Population'],
    uri: 'http://dotstatcor-dev2.main.oecd.org/NsiWebserviceDisseminationExternal/rest/data/OECD,POPULATION,1.0/.YP9901L1..',
    index: 0,
    matches: [
      {
        type: 'dataflow',
        'match-text':
          '<mark>Population</mark> broken down by country and sex for various indicators. (<mark>POPULATION</mark>)',
      },
      {
        type: 'description',
        'match-text':
          '<mark>Population</mark> broken down by country and sex for various indicators.',
      },
      {
        type: 'topic',
        'match-text': 'Demography and <mark>population</mark>',
      },
      {
        type: 'code',
        'match-text':
          '<mark>Population</mark> (hist5)  00-04, persons (YP9901L1) \r\nPopulation (hist5)  05-09, persons (YP9902L1) \r\n...',
      },
    ],
  },
  {
    id: 'OECD:GDP_CUR_NEW(1.0)',
    title:
      'Gross domestic product (GDP) at current prices - New DF (GDP_CUR_NEW)',
    description: '',
    lastUpdated: '2018-01-24 16:03:43',
    topics: ['Economy and finance'],
    uri: 'http://dotstatcor-dev2.main.oecd.org/NsiWebserviceDisseminationExternal/rest/data/OECD,GDP_CUR_NEW,1.0/...',
    index: 1,
    matches: [
      {
        'match-text':
          'Bank lending volume (BLV) Financial situation - market <mark>financing</mark> conditions (BMFC) Financial situation - profitability (BPRO)',
        type: 'dataflow',
      },
    ],
  },
  {
    id: 'OECD:GDP_CUR(2.0)',
    title: 'Gross domestic product (GDP) at current prices (GDP_CUR)',
    description: '',
    lastUpdated: '2018-01-24 14:44:48',
    topics: ['Economy and finance'],
    uri: 'http://dotstatcor-dev2.main.oecd.org/NsiWebserviceDisseminationExternal/rest/data/OECD,GDP_CUR,2.0/...',
    index: 2,
    matches: [
      {
        concept: 'Bank lending survey item',
        'match-text':
          'Bank lending volume (BLV) Financial situation - market <mark>financing</mark> conditions (BMFC) Financial situation - profitability (BPRO)',
        type: 'code',
      },
      {
        concept:
          'Source of property price <mark>statistics</mark> (RPP_SOURCE)',
        'match-text': 'Source of property price statistics (RPP_SOURCE)',
        type: 'dimension',
      },
    ],
  },
];
