export default {
  header: {
    id: '28096b3b-bd2f-4875-8105-b919fbc58ab2',
    test: false,
    prepared: '2017-03-20T15:46:58.775625Z',
    sender: {
      id: 'OECD',
      name: 'Organisation for Economic Co-operation and Development',
    },
    links: [
      {
        href: 'http://stats.oecd.org:80/SDMX-JSON/data/KEI/PRINTO01+PRMNTO01.AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA.GP.A/all?startTime=2015&endTime=2015&dimensionAtObservation=allDimensions',
        rel: 'request',
      },
    ],
  },
  dataSets: [
    {
      action: 'Information',
      observations: {
        '0:0:0:0:0': [1.18005263064255, 0, null, 0, 0, null],
        '0:1:0:0:0': [2.11995066296641, 0, null, 0, 0, null],
        '0:2:0:0:0': [-0.0160655474335108, 0, null, 0, 0, null],
        '0:3:0:0:0': [-0.734931326089172, 0, null, 0, 0, null],
        '0:4:0:0:0': [4.62318401937048, 0, null, 0, 0, null],
        '0:5:0:0:0': [1.18634492777014, 0, null, 0, 0, null],
        '0:6:0:0:0': [-0.958831808585503, 0, null, 0, 0, null],
        '0:7:0:0:0': [1.96360436882936, 0, null, 0, 0, null],
        '0:8:0:0:0': [0.230172987500003, 0, null, 0, 0, null],
        '0:9:0:0:0': [0.292360493199452, 0, null, 0, 0, null],
        '1:3:0:0:0': [0.178223109790082, 0, null, 0, 0, null],
        '1:0:0:0:0': [-1.70548071959404, 0, null, 0, 0, null],
        '1:7:0:0:0': [1.92806480043649, 0, null, 0, 0, null],
        '1:6:0:0:0': [-0.938640709195226, 0, null, 0, 0, null],
        '1:9:0:0:0': [1.4055978394304, 0, null, 0, 0, null],
        '1:2:0:0:0': [0.177647331428157, 0, null, 0, 0, null],
        '1:5:0:0:0': [2.47915590644139, 0, null, 0, 0, null],
        '1:8:0:0:0': [0.286348587500551, 0, null, 0, 0, null],
        '1:4:0:0:0': [6.01902272562258, 0, null, 0, 0, null],
        '1:1:0:0:0': [2.36545969532268, 0, null, 0, 0, null],
      },
    },
  ],
  structure: {
    links: [
      {
        href: 'http://stats.oecd.org/SDMX-JSON/dataflow/KEI/all',
        rel: 'dataflow',
      },
    ],
    name: 'Key Short-Term Economic Indicators',
    description: 'Key Short-Term Economic Indicators',
    dimensions: {
      observation: [
        {
          keyPosition: 0,
          id: 'SUBJECT',
          name: 'Subject',
          values: [
            {
              id: 'PRINTO01',
              name: 'Industrial production, s.a.',
            },
            {
              id: 'PRMNTO01',
              name: 'Total manufacturing, s.a.',
            },
          ],
        },
        {
          keyPosition: 1,
          id: 'LOCATION',
          name: 'Country',
          values: [
            {
              id: 'AUS',
              name: 'Australia',
            },
            {
              id: 'AUT',
              name: 'Austria',
            },
            {
              id: 'BEL',
              name: 'Belgium',
            },
            {
              id: 'CAN',
              name: 'Canada',
            },
            {
              id: 'CZE',
              name: 'Czech Republic',
            },
            {
              id: 'DNK',
              name: 'Denmark',
            },
            {
              id: 'FIN',
              name: 'Finland',
            },
            {
              id: 'FRA',
              name: 'France',
            },
            {
              id: 'CHL',
              name: 'Chile',
            },
            {
              id: 'EST',
              name: 'Estonia',
            },
          ],
          role: 'REF_AREA',
        },
        {
          keyPosition: 2,
          id: 'MEASURE',
          name: 'Measure',
          values: [
            {
              id: 'GP',
              name: 'Growth previous period',
            },
          ],
        },
        {
          keyPosition: 3,
          id: 'FREQUENCY',
          name: 'Frequency',
          values: [
            {
              id: 'A',
              name: 'Annual',
            },
          ],
          role: 'FREQ',
        },
        {
          id: 'TIME_PERIOD',
          name: 'Time',
          values: [
            {
              id: '2015',
              name: '2015',
            },
          ],
          role: 'TIME_PERIOD',
        },
      ],
    },
    attributes: {
      dataSet: [],
      series: [],
      observation: [
        {
          id: 'TIME_FORMAT',
          name: 'Time Format',
          values: [
            {
              id: 'P1Y',
              name: 'Annual',
            },
          ],
        },
        {
          id: 'OBS_STATUS',
          name: 'Observation Status',
          values: [],
        },
        {
          id: 'UNIT',
          name: 'Unit',
          values: [
            {
              id: 'PC',
              name: 'Percentage',
            },
          ],
          role: 'UNIT_MEASURE',
        },
        {
          id: 'POWERCODE',
          name: 'Unit multiplier',
          default: '0',
          values: [
            {
              id: '0',
              name: 'Units',
            },
          ],
          role: 'UNIT_MULT',
        },
        {
          id: 'REFERENCEPERIOD',
          name: 'Reference period',
          values: [],
          role: 'BASE_PER',
        },
      ],
    },
    annotations: [
      {
        title: 'Copyright OECD - All rights reserved',
        uri: '',
        text: '',
      },
      {
        title: 'Terms and Conditions',
        uri: 'http://www.oecd.org/termsandconditions/',
        text: '',
      },
      {
        title: 'Privacy Policy',
        uri: 'http://www.oecd.org/privacy/',
        text: '',
      },
      {
        title: 'MyOECD',
        uri: 'https://www.oecd.org/login',
        text: '',
      },
      {
        title: 'Contact Us',
        uri: 'http://www.oecd.org/contact/',
        text: '',
      },
    ],
  },
};
