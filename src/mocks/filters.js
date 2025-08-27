export const dataflow1 = {
  version: '1.0',
  agencyId: 'ECB',
  name: 'Exchange Rates',
  code: 'EXR',
};

export const dataflow2 = {
  version: '1.0',
  agencyId: 'ECB',
  name: '[EXR]',
  code: 'EXR',
};

export const dataflow3 = {
  version: '1.0',
  agencyId: 'ECB',
  name: 'test',
  code: 'EXR',
};

export const output1 = {
  dimensions: [
    {
      id: 'FREQ',
      index: 0,
      label: 'Frequency',
      roles: ['FREQ'],
      values: [
        {
          id: 'A',
          isDefaultSelected: false,
          label: 'Annual',
          parentId: undefined,
        },
        {
          id: 'M',
          isDefaultSelected: false,
          label: 'Monthly',
          parentId: undefined,
        },
        {
          id: 'Q',
          isDefaultSelected: false,
          label: 'Quarterly',
          parentId: undefined,
        },
      ],
    },
    {
      id: 'CURRENCY',
      index: 1,
      label: 'Currency',
      roles: [],
      values: [
        {
          id: '_T',
          isDefaultSelected: false,
          label: 'All currencies',
          parentId: undefined,
        },
        {
          id: 'EUR',
          isDefaultSelected: true,
          label: 'Euro',
          parentId: '_T',
        },
      ],
    },
    {
      id: 'CURRENCY_DENOM',
      index: 2,
      label: 'Currency denominator',
      roles: [],
      values: [
        {
          id: '_T',
          isDefaultSelected: false,
          label: 'All currencies',
          parentId: undefined,
        },
        {
          id: 'EUR',
          isDefaultSelected: false,
          label: 'Euro',
          parentId: '_T',
        },
      ],
    },
    {
      id: 'EXR_TYPE',
      index: 3,
      label: 'Exchange rate type',
      roles: [],
      values: [
        {
          id: 'NRP0',
          isDefaultSelected: false,
          label:
            'Real harmonised competitiveness indicator Producer Prices deflated',
          parentId: undefined,
        },
        {
          id: 'ERU1',
          isDefaultSelected: false,
          label: 'Real effective exch. rate ULC total economy deflated',
          parentId: undefined,
        },
        {
          id: 'ERC0',
          isDefaultSelected: false,
          label: 'Real effective exch. rate CPI deflated',
          parentId: undefined,
        },
        {
          id: 'SP00',
          isDefaultSelected: false,
          label: 'Spot',
          parentId: undefined,
        },
        {
          id: 'RR00',
          isDefaultSelected: false,
          label: 'Reference rate',
          parentId: undefined,
        },
        {
          id: 'EN00',
          isDefaultSelected: false,
          label: 'Nominal effective exch. rate',
          parentId: undefined,
        },
      ],
    },
    {
      id: 'EXR_SUFFIX',
      index: 4,
      label: 'Series variation - EXR context',
      roles: [],
      values: [
        {
          id: 'A',
          isDefaultSelected: false,
          label: 'Average',
          parentId: undefined,
        },
        {
          id: 'E',
          isDefaultSelected: false,
          label: 'End-of-period',
          parentId: undefined,
        },
        {
          id: 'P',
          isDefaultSelected: false,
          label: 'Growth rate to previous period',
          parentId: undefined,
        },
        {
          id: 'R',
          isDefaultSelected: false,
          label: 'Annual rate of change',
          parentId: undefined,
        },
        {
          id: 'S',
          isDefaultSelected: false,
          label:
            'Percentage change since December 1998 (1998Q4 for quarterly data)',
          parentId: undefined,
        },
        {
          id: 'T',
          isDefaultSelected: false,
          label: '3-year percentage change',
          parentId: undefined,
        },
      ],
    },
  ],
  dataflow: dataflow1,
  params: {
    lastNObservations: undefined,
  },
};

export const output2 = {
  dimensions: [
    {
      id: 'FREQ',
      index: 0,
      label: 'test',
      roles: ['FREQ'],
      values: [
        {
          id: 'A',
          isDefaultSelected: true,
          label: 'test',
          parentId: undefined,
        },
        {
          id: 'M',
          isDefaultSelected: false,
          label: 'test',
          parentId: undefined,
        },
        {
          id: 'Q',
          isDefaultSelected: false,
          label: 'test',
          parentId: undefined,
        },
      ],
    },
  ],
  dataflow: dataflow3,
  params: {
    lastNObservations: undefined,
  },
};

export const output4 = {
  dimensions: [
    {
      id: 'FREQ',
      index: 0,
      label: 'Frequency',
      roles: ['FREQ'],
      values: [
        {
          id: 'A',
          isDefaultSelected: true,
          label: '[A]',
          parentId: undefined,
        },
        {
          id: 'M',
          isDefaultSelected: false,
          label: 'Monthly',
          parentId: undefined,
        },
        {
          id: 'Q',
          isDefaultSelected: false,
          label: 'Quarterly',
          parentId: undefined,
        },
      ],
    },
  ],
  dataflow: dataflow1,
  params: {
    lastNObservations: undefined,
  },
};

export const output5 = {
  dimensions: [
    {
      id: 'FREQ',
      index: 0,
      label: '[FREQ]',
      roles: ['FREQ'],
      values: [
        {
          id: 'A',
          isDefaultSelected: true,
          label: 'Annual',
          parentId: undefined,
        },
        {
          id: 'M',
          isDefaultSelected: false,
          label: 'Monthly',
          parentId: undefined,
        },
        {
          id: 'Q',
          isDefaultSelected: false,
          label: 'Quarterly',
          parentId: undefined,
        },
      ],
    },
  ],
  dataflow: dataflow1,
  params: {
    lastNObservations: undefined,
  },
};

export const output6 = {
  dimensions: [
    {
      id: 'EXR_SUFFIX',
      index: 4,
      label: 'Series variation - EXR context',
      roles: [],
      values: [
        {
          id: '01',
          isDefaultSelected: false,
          label: 'All currencies',
          parentId: undefined,
        },
        {
          id: '10',
          isDefaultSelected: false,
          label: 'Euro',
          parentId: '01',
        },
        {
          id: '100',
          isDefaultSelected: false,
          label: 'hundred',
          parentId: '10',
        },
        {
          id: '1000',
          isDefaultSelected: false,
          label: 'thousand',
          parentId: '100',
        },
        {
          id: '10000',
          isDefaultSelected: false,
          label: 'ten thousand',
          parentId: '1000',
        },
      ],
    },
  ],
  dataflow: dataflow1,
  params: {
    lastNObservations: undefined,
  },
};

export const output9 = {
  dimensions: [
    {
      id: 'EXR_SUFFIX',
      index: 4,
      label: '[EXR_SUFFIX]',
      roles: [],
      values: [
        {
          id: '01',
          isDefaultSelected: false,
          label: '[01]',
          parentId: undefined,
        },
      ],
    },
  ],
  dataflow: dataflow2,
  params: {
    lastNObservations: undefined,
  },
};

export const output10 = {
  dataflow: {
    agencyId: 'OECD',
    code: 'TEST_ANN',
    name: 'Test of annotations | Mike test 3',
    version: '1.0',
  },
  dimensions: [
    {
      id: 'DIMENSION_ROW',
      index: 0,
      label: 'Dimension to be shown in row section',
      roles: [],
      values: [
        {
          id: 'FFF',
          isDefaultSelected: false,
          label: 'Fff',
          parentId: undefined,
        },
        {
          id: 'HHH',
          isDefaultSelected: false,
          label: 'Hhh',
          parentId: undefined,
        },
        {
          id: 'III',
          isDefaultSelected: false,
          label: 'Iii',
          parentId: undefined,
        },
        {
          id: 'JJJ',
          isDefaultSelected: false,
          label: 'Jjj',
          parentId: undefined,
        },
        {
          id: 'GGG',
          isDefaultSelected: false,
          label: 'Ggg',
          parentId: undefined,
        },
        {
          id: 'EEE',
          isDefaultSelected: false,
          label: 'Eee',
          parentId: undefined,
        },
        {
          id: 'CCC',
          isDefaultSelected: false,
          label: 'Ccc',
          parentId: undefined,
        },
        {
          id: 'DDD',
          isDefaultSelected: false,
          label: 'Ddd',
          parentId: undefined,
        },
        {
          id: 'BBB',
          isDefaultSelected: false,
          label: 'Bbb',
          parentId: undefined,
        },
        {
          id: 'AAA',
          isDefaultSelected: false,
          label: 'Aaa',
          parentId: undefined,
        },
      ],
    },
    {
      id: 'DIMENSION_SECTION',
      index: 2,
      label: 'Dimension to be shown in section',
      roles: [],
      values: [
        {
          id: 'F',
          isDefaultSelected: false,
          label: 'Female',
          parentId: undefined,
        },
        {
          id: 'M',
          isDefaultSelected: true,
          label: 'Male',
          parentId: undefined,
        },
        {
          id: '_T',
          isDefaultSelected: false,
          label: 'Total',
          parentId: undefined,
        },
      ],
    },
  ],
  params: {
    lastNObservations: undefined,
  },
};
