export const spaces = {
  disseminate: {
    endpoint:
      'http://dotstatcor-dev1.main.oecd.org/Demo2NsiWebserviceDisseminationExternal/rest',
    supportsReferencePartial: false,
    hasRangeHeader: false,
  },
  FEDev1: {
    endpoint:
      'http://dotstatcor-dev1.main.oecd.org/Demo2NsiWebserviceDisseminationExternal/rest',
    supportsReferencePartial: true,
    hasRangeHeader: true,
  },
};

export const isTimeDimensionInverted = false;
export const dimensionGetter = 'label';

export const dataflow = {
  agencyId: 'OECD',
  code: 'Dataflow_GENERAL_DATASET_3DIM_PUBLIC',
  data: '..',
  endpointId: 'disseminate',
  version: '1.4',
  name: 'GENERAL_DATASET_3DIM_PUBLIC',
};

export const dataflow1 = {
  agencyId: 'OECD',
  code: 'Dataflow_GENERAL_DATASET_3DIM_PUBLIC',
  data: '..',
  endpointId: 'FEDev1',
  version: '1.4',
  name: 'GENERAL_DATASET_3DIM_PUBLIC',
};

export const layout = {
  rows: [],
  header: [],
  sections: [],
};

export const viewerId = 'BarChart';

export const actionId = 'api';

export const period = [1998, 2016];

export const filters = [0, 1, 2, 3, 4];

export const selection = {
  '1281accbcedc6ddd8f36508b71ae6043': { filterIndex: 1, valueId: 'EUR' },
  da94a07a667737610f46dc0a7d2187b3: { filterIndex: 4, valueId: 'E' },
  acc0e15ad7914acf55fd099d980ab6bb: { filterIndex: 4, valueId: 'R' },
};

export const getters = {
  d: 'label',
};

export const outputDimension = {
  many: {
    LOCATION: {
      id: 'LOCATION',
      index: 1,
      keyPosition: 1,
      name: 'Country',
      role: 'REF_AREA',
      values: [
        {
          id: 'AUS',
          index: 0,
          name: 'Australia',
        },
        {
          id: 'AUT',
          index: 1,
          name: 'Austria',
        },
        {
          id: 'BEL',
          index: 2,
          name: 'Belgium',
        },
        {
          id: 'CAN',
          index: 3,
          name: 'Canada',
        },
        {
          id: 'CZE',
          index: 4,
          name: 'Czech Republic',
        },
        {
          id: 'DNK',
          index: 5,
          name: 'Denmark',
        },
        {
          id: 'FIN',
          index: 6,
          name: 'Finland',
        },
        {
          id: 'FRA',
          index: 7,
          name: 'France',
        },
        {
          id: 'CHL',
          index: 8,
          name: 'Chile',
        },
        {
          id: 'EST',
          index: 9,
          name: 'Estonia',
        },
      ],
    },
    SUBJECT: {
      id: 'SUBJECT',
      index: 0,
      keyPosition: 0,
      name: 'Subject',
      values: [
        {
          id: 'PRINTO01',
          index: 0,
          name: 'Industrial production, s.a.',
        },
        {
          id: 'PRMNTO01',
          index: 1,
          name: 'Total manufacturing, s.a.',
        },
      ],
    },
  },
  one: {
    FREQUENCY: {
      id: 'FREQUENCY',
      index: 3,
      keyPosition: 3,
      name: 'Frequency',
      role: 'FREQ',
      values: [
        {
          id: 'A',
          index: 0,
          name: 'Annual',
        },
      ],
    },
    MEASURE: {
      id: 'MEASURE',
      index: 2,
      keyPosition: 2,
      name: 'Measure',
      values: [
        {
          id: 'GP',
          index: 0,
          name: 'Growth previous period',
        },
      ],
    },
    TIME_PERIOD: {
      id: 'TIME_PERIOD',
      index: 4,
      name: 'Time',
      role: 'TIME_PERIOD',
      values: [
        {
          id: '2015',
          index: 0,
          name: '2015',
        },
      ],
    },
  },
  zero: {},
};
