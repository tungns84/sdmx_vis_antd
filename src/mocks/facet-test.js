export const basicFacets = {
  dim_REF_AREA_s: {
    name: 'REF_AREA',
    value: 'Reference Area',
    type: 'Dimension',
    order: 2,
    facetValues: [
      {
        name: 'EE',
        value: 'ESTONIA',
        count: 2,
      },
      {
        name: 'FR',
        value: 'FRANCE',
        count: 2,
      },
      {
        name: 'AFR|AFRRWA',
        value: 'Africa|Rwanda',
        count: 1,
      },
      {
        name: 'AFR|AFRRWA|AFRRWA005',
        value: 'Africa|Rwanda|East',
        count: 1,
      },
      {
        name: 'AFR|AFRRWA|AFRRWA001',
        value: 'Africa|Rwanda|Kigali City',
        count: 1,
      },
      {
        name: 'AFR|AFRRWA|AFRRWA004',
        value: 'Africa|Rwanda|North',
        count: 1,
      },
      {
        name: 'AFR|AFRRWA|AFRRWA002',
        value: 'Africa|Rwanda|South',
        count: 1,
      },
      {
        name: 'AFR|AFRRWA|AFRRWA003',
        value: 'Africa|Rwanda|West',
        count: 1,
      },
      {
        name: 'CHN',
        value: 'China',
        count: 1,
      },
      {
        name: 'AFRRWA',
        value: 'Rwanda',
        count: 1,
      },
      {
        name: 'ES',
        value: 'SPAIN',
        count: 1,
      },
      {
        name: 'TN',
        value: 'Tunisia total',
        count: 1,
      },
    ],
  },
  topic_s: {
    name: 'OECD:OECDCS1(1.0)',
    value: 'Dissemination category scheme',
    type: 'Category',
    order: 1,
    facetValues: [
      {
        name: 'OECDCS1|ECO',
        value: 'Economy and finance',
        count: 6,
      },
      {
        name: 'OECDCS1|AGRI',
        value: 'Agriculture and fisheries',
        count: 1,
      },
    ],
  },
};

export const basicFacetWithMissingValues = {
  dim_REF_AREA_s: {
    name: 'REF_AREA',
    value: 'Reference Area',
    type: 'Dimension',
    order: 1,
    facetValues: [
      {
        name: 'AFR|AFRRWA|AFRRWA005',
        value: 'Africa|Rwanda|East',
        count: 1,
      },
      {
        name: 'AFR|AFRRWA|AFRRWA001',
        value: 'Africa|Rwanda|Kigali City',
        count: 1,
      },
      {
        name: 'AFR|AFRRWA|AFRRWA004',
        value: 'Africa|Rwanda|North',
        count: 1,
      },
      {
        name: 'AFR|AFRRWA|AFRRWA002',
        value: 'Africa|Rwanda|South',
        count: 1,
      },
      {
        name: 'AFR|AFRRWA|AFRRWA003',
        value: 'Africa|Rwanda|West',
        count: 1,
      },
    ],
  },
};

export const basicTree = {
  currents: [],
  filters: [
    {
      id: 'topic_s',
      label: 'Dissemination category scheme',
      type: 'Category',
      index: 1,
      code: 'OECD:OECDCS1(1.0)',
      tag: '0/2',
      selection: [],
      values: [
        {
          childNodes: [
            {
              id: 'OECDCS1|ECO',
              label: 'Economy and finance',
              isSelected: false,
              parentId: 'OECDCS1',
              parentLabels: [],
              secondaryLabel: '(6)',
            },
            {
              id: 'OECDCS1|AGRI',
              label: 'Agriculture and fisheries',
              isSelected: false,
              parentId: 'OECDCS1',
              parentLabels: [],
              secondaryLabel: '(1)',
            },
          ],
          className: 'pt-disabled',
          id: 'OECDCS1',
          isDisabled: true,
          label: undefined,
          parentId: '',
          parentLabels: [],
        },
      ],
    },
    {
      id: 'dim_REF_AREA_s',
      label: 'Reference Area',
      type: 'Dimension',
      index: 2,
      code: 'REF_AREA',
      selection: [],
      tag: '0/12',
      values: [
        {
          id: 'EE',
          label: 'ESTONIA',
          isSelected: false,
          parentId: '',
          parentLabels: [],
          secondaryLabel: '(2)',
        },
        {
          id: 'FR',
          label: 'FRANCE',
          isSelected: false,
          parentId: '',
          parentLabels: [],
          secondaryLabel: '(2)',
        },
        {
          id: 'AFR',
          label: 'Africa',
          isDisabled: true,
          className: 'pt-disabled',
          parentId: '',
          parentLabels: [],
          childNodes: [
            {
              id: 'AFR|AFRRWA',
              isSelected: false,
              label: 'Rwanda',
              parentId: 'AFR',
              parentLabels: ['Africa'],
              secondaryLabel: '(1)',
              childNodes: [
                {
                  id: 'AFR|AFRRWA|AFRRWA005',
                  label: 'East',
                  isSelected: false,
                  parentId: 'AFR|AFRRWA',
                  parentLabels: ['Africa', 'Rwanda'],
                  secondaryLabel: '(1)',
                },
                {
                  id: 'AFR|AFRRWA|AFRRWA001',
                  label: 'Kigali City',
                  isSelected: false,
                  parentId: 'AFR|AFRRWA',
                  parentLabels: ['Africa', 'Rwanda'],
                  secondaryLabel: '(1)',
                },
                {
                  id: 'AFR|AFRRWA|AFRRWA004',
                  label: 'North',
                  isSelected: false,
                  parentId: 'AFR|AFRRWA',
                  parentLabels: ['Africa', 'Rwanda'],
                  secondaryLabel: '(1)',
                },
                {
                  id: 'AFR|AFRRWA|AFRRWA002',
                  label: 'South',
                  isSelected: false,
                  parentId: 'AFR|AFRRWA',
                  parentLabels: ['Africa', 'Rwanda'],
                  secondaryLabel: '(1)',
                },
                {
                  id: 'AFR|AFRRWA|AFRRWA003',
                  label: 'West',
                  isSelected: false,
                  parentId: 'AFR|AFRRWA',
                  parentLabels: ['Africa', 'Rwanda'],
                  secondaryLabel: '(1)',
                },
              ],
            },
          ],
        },
        {
          id: 'CHN',
          label: 'China',
          isSelected: false,
          parentId: '',
          parentLabels: [],
          secondaryLabel: '(1)',
        },
        {
          id: 'AFRRWA',
          label: 'Rwanda',
          isSelected: false,
          parentId: '',
          parentLabels: [],
          secondaryLabel: '(1)',
        },
        {
          id: 'ES',
          label: 'SPAIN',
          isSelected: false,
          parentId: '',
          parentLabels: [],
          secondaryLabel: '(1)',
        },
        {
          id: 'TN',
          label: 'Tunisia total',
          isSelected: false,
          parentId: '',
          parentLabels: [],
          secondaryLabel: '(1)',
        },
      ],
    },
  ],
};

export const basicTreeWithAddedParents = {
  selection: [],
  values: [
    {
      id: 'AFR',
      label: 'Africa',
      isDisabled: true,
      className: 'pt-disabled',
      parentId: '',
      parentLabels: [],
      childNodes: [
        {
          id: 'AFR|AFRRWA',
          label: 'Rwanda',
          isDisabled: true,
          className: 'pt-disabled',
          parentId: 'AFR',
          parentLabels: ['Africa'],
          childNodes: [
            {
              id: 'AFR|AFRRWA|AFRRWA005',
              label: 'East',
              secondaryLabel: '(1)',
              isSelected: false,
              parentId: 'AFR|AFRRWA',
              parentLabels: ['Africa', 'Rwanda'],
            },
            {
              id: 'AFR|AFRRWA|AFRRWA001',
              label: 'Kigali City',
              secondaryLabel: '(1)',
              isSelected: false,
              parentId: 'AFR|AFRRWA',
              parentLabels: ['Africa', 'Rwanda'],
            },
            {
              id: 'AFR|AFRRWA|AFRRWA004',
              label: 'North',
              secondaryLabel: '(1)',
              isSelected: false,
              parentId: 'AFR|AFRRWA',
              parentLabels: ['Africa', 'Rwanda'],
            },
            {
              id: 'AFR|AFRRWA|AFRRWA002',
              label: 'South',
              secondaryLabel: '(1)',
              isSelected: false,
              parentId: 'AFR|AFRRWA',
              parentLabels: ['Africa', 'Rwanda'],
            },
            {
              id: 'AFR|AFRRWA|AFRRWA003',
              label: 'West',
              secondaryLabel: '(1)',
              isSelected: false,
              parentId: 'AFR|AFRRWA',
              parentLabels: ['Africa', 'Rwanda'],
            },
          ],
        },
      ],
    },
  ],
};

export const tree = {
  currents: [
    {
      id: 'topic_s',
      label: 'Dissemination category scheme',
      type: 'Category',
      index: 1,
      code: 'OECD:OECDCS1(1.0)',
      tag: '2/5',
      selection: [
        {
          id: 'OECDCS1|DEMO',
          isSelected: true,
          label: 'Demography and population',
          parentId: 'OECDCS1',
          parentLabels: [],
          secondaryLabel: '(3)',
        },
        {
          id: 'OECDCS1|DEMO/OECDCS1|DEMO.DEMO2',
          isSelected: true,
          label: 'Demography and population/Population',
          parentId: 'OECDCS1|DEMO/OECDCS1',
          parentLabels: [],
          secondaryLabel: '(3)',
        },
      ],
      values: [
        {
          id: 'OECDCS1|DEMO',
          isSelected: true,
          label: 'Demography and population',
          parentId: 'OECDCS1',
          parentLabels: [],
          secondaryLabel: '(3)',
        },
        {
          id: 'OECDCS1|DEMO/OECDCS1|DEMO.DEMO2',
          isSelected: true,
          label: 'Demography and population/Population',
          parentId: 'OECDCS1|DEMO/OECDCS1',
          parentLabels: [],
          secondaryLabel: '(3)',
        },
      ],
    },
  ],
  filters: [
    {
      code: 'OECD:OECDCS1(1.0)',
      id: 'topic_s',
      index: 1,
      label: 'Dissemination category scheme',
      selection: [
        {
          id: 'OECDCS1|DEMO',
          isSelected: true,
          label: 'Demography and population',
          parentId: 'OECDCS1',
          parentLabels: [],
          secondaryLabel: '(3)',
        },
        {
          id: 'OECDCS1|DEMO/OECDCS1|DEMO.DEMO2',
          isSelected: true,
          label: 'Demography and population/Population',
          parentId: 'OECDCS1|DEMO/OECDCS1',
          parentLabels: [],
          secondaryLabel: '(3)',
        },
      ],
      tag: '2/5',
      type: 'Category',
      values: [
        {
          childNodes: [
            {
              id: 'OECDCS1|ECO',
              isSelected: false,
              label: 'Economy and finance',
              parentId: 'OECDCS1',
              parentLabels: [],
              secondaryLabel: '(6)',
            },
            {
              id: 'OECDCS1|AGRI',
              isSelected: false,
              label: 'Agriculture and fisheries',
              parentId: 'OECDCS1',
              parentLabels: [],
              secondaryLabel: '(4)',
            },
            {
              id: 'OECDCS1|SOC',
              isSelected: false,
              label: 'Social conditions',
              parentId: 'OECDCS1',
              parentLabels: [],
              secondaryLabel: '(4)',
            },
            {
              id: 'OECDCS1|DEMO',
              isSelected: true,
              label: 'Demography and population',
              parentId: 'OECDCS1',
              parentLabels: [],
              secondaryLabel: '(3)',
            },
          ],
          className: 'pt-disabled',
          id: 'OECDCS1',
          isDisabled: true,
          label: undefined,
          parentId: '',
          parentLabels: [],
        },
        {
          childNodes: [
            {
              id: 'OECDCS1|DEMO/OECDCS1|DEMO.DEMO2',
              isSelected: true,
              label: 'Demography and population/Population',
              parentId: 'OECDCS1|DEMO/OECDCS1',
              parentLabels: [],
              secondaryLabel: '(3)',
            },
          ],
          parentId: '',
          parentLabels: [],
          className: 'pt-disabled',
          id: 'OECDCS1|DEMO/OECDCS1',
          isDisabled: true,
          label: undefined,
        },
      ],
    },
    {
      id: 'dim_REF_AREA_s',
      label: 'Reference area',
      type: 'Dimension',
      index: 2,
      code: 'REF_AREA',
      tag: '0/3',
      selection: [],
      values: [
        {
          id: 'EE',
          label: 'ESTONIA',
          secondaryLabel: '(2)',
          isSelected: false,
          parentId: '',
          parentLabels: [],
        },
        {
          id: 'FR',
          label: 'FRANCE',
          secondaryLabel: '(2)',
          isSelected: false,
          parentId: '',
          parentLabels: [],
        },
        {
          id: 'ES',
          label: 'SPAIN',
          secondaryLabel: '(1)',
          isSelected: false,
          parentId: '',
          parentLabels: [],
        },
      ],
    },
    {
      id: 'dim_ACTIVITY_s',
      label: 'Economic activity',
      type: 'Dimension',
      index: 3,
      code: 'ACTIVITY',
      tag: '0/6',
      selection: [],
      values: [
        {
          id: 'GDP',
          label: 'Gross domestic product',
          isSelected: false,
          parentId: '',
          parentLabels: [],
          secondaryLabel: '(10)',
        },
        {
          id: 'GDP/B1_GA',
          isSelected: false,
          label: 'Gross domestic product/GDP: Output approach',
          parentId: '',
          parentLabels: [],
          secondaryLabel: '(2)',
        },
        {
          id: 'GDP/B1_GA/D1',
          isSelected: false,
          label:
            'Gross domestic product/GDP: Output approach/Compensation of employees',
          parentId: '',
          parentLabels: [],
          secondaryLabel: '(2)',
        },
        {
          id: 'GDP/B1_GA/D1/D1VA',
          isSelected: false,
          label:
            'Gross domestic product/GDP: Output approach/Compensation of employees/Agriculture, forestry and fishing (ISIC rev4)',
          parentId: '',
          parentLabels: [],
          secondaryLabel: '(2)',
        },
        {
          id: 'GDP/B1_GA/D1/D1VF',
          isSelected: false,
          label:
            'Gross domestic product/GDP: Output approach/Compensation of employees/Construction (ISIC rev4)',
          parentId: '',
          parentLabels: [],
          secondaryLabel: '(2)',
        },
        {
          id: 'GDP/B1_GA/D1/D1VG_I',
          isSelected: false,
          label:
            'Gross domestic product/GDP: Output approach/Compensation of employees/Distributive trade, repairs; transport; accommod., food serv. (ISIC rev4)',
          parentId: '',
          parentLabels: [],
          secondaryLabel: '(2)',
        },
      ],
    },
  ],
};

export const selectionTopics = {
  '5f5d1fc8197c284a6dad64e0966b6642': {
    filterId: 'topic_s',
    valueId: 'OECDCS1|DEMO',
  },
  '620466f25d25c6e852de4a8ca3d07c45': {
    filterId: 'topic_s',
    valueId: 'OECDCS1|DEMO|OECDCS1|DEMO.DEMO2',
  },
};

export const selectionActivity = {
  c55c992b4699049b407a30a3851cfb7e: {
    filterId: 'dim_ACTIVITY_s',
    valueId: 'GDP|B1_GA',
  },
  '748768d7bb2496bfd8137ef6914fd610': {
    filterId: 'dim_ACTIVITY_s',
    valueId: 'GDP|B1_GA|D1',
  },
  '7685ed0fe4e8ceaaa76892151cfa0581': {
    filterId: 'dim_ACTIVITY_s',
    valueId: 'GDP|B1_GA|D1|D1VA',
  },
};

export const treeWithSelection = {
  selection: [
    {
      selection: [
        {
          id: 'OECDCS1|DEMO',
          isSelected: true,
          label: 'Demography and population',
          parentId: 'OECDCS1',
          parentLabels: [],
          secondaryLabel: '(3)',
        },
        {
          id: 'OECDCS1|DEMO/OECDCS1|DEMO.DEMO2',
          isSelected: true,
          label: 'Demography and population/Population',
          parentId: 'OECDCS1|DEMO/OECDCS1',
          parentLabels: [],
          secondaryLabel: '(3)',
        },
      ],
      values: [
        {
          childNodes: [
            {
              id: 'OECDCS1|ECO',
              isSelected: false,
              label: 'Economy and finance',
              parentId: 'OECDCS1',
              parentLabels: [],
              secondaryLabel: '(6)',
            },
            {
              id: 'OECDCS1|AGRI',
              isSelected: false,
              label: 'Agriculture and fisheries',
              parentId: 'OECDCS1',
              parentLabels: [],
              secondaryLabel: '(4)',
            },
            {
              id: 'OECDCS1|SOC',
              isSelected: false,
              label: 'Social conditions',
              parentId: 'OECDCS1',
              parentLabels: [],
              secondaryLabel: '(4)',
            },
            {
              id: 'OECDCS1|DEMO',
              isSelected: true,
              label: 'Demography and population',
              parentId: 'OECDCS1',
              parentLabels: [],
              secondaryLabel: '(3)',
            },
          ],
          className: 'pt-disabled',
          id: 'OECDCS1',
          isDisabled: true,
          label: undefined,
          parentId: '',
          parentLabels: [],
        },
        {
          childNodes: [
            {
              id: 'OECDCS1|DEMO/OECDCS1|DEMO.DEMO2',
              isSelected: true,
              label: 'Demography and population/Population',
              parentId: 'OECDCS1|DEMO/OECDCS1',
              parentLabels: [],
              secondaryLabel: '(3)',
            },
          ],
          className: 'pt-disabled',
          id: 'OECDCS1|DEMO/OECDCS1',
          isDisabled: true,
          label: undefined,
          parentId: '',
          parentLabels: [],
        },
      ],
    },
    {
      selection: [
        {
          id: 'GDP/B1_GA',
          isSelected: true,
          label: 'Gross domestic product/GDP: Output approach',
          parentId: '',
          parentLabels: [],
          secondaryLabel: '(2)',
        },
        {
          id: 'GDP/B1_GA/D1',
          isSelected: true,
          label:
            'Gross domestic product/GDP: Output approach/Compensation of employees',
          parentId: '',
          parentLabels: [],
          secondaryLabel: '(2)',
        },
        {
          id: 'GDP/B1_GA/D1/D1VA',
          isSelected: true,
          label:
            'Gross domestic product/GDP: Output approach/Compensation of employees/Agriculture, forestry and fishing (ISIC rev4)',
          parentId: '',
          parentLabels: [],
          secondaryLabel: '(2)',
        },
      ],
      values: [
        {
          id: 'GDP',
          isSelected: false,
          label: 'Gross domestic product',
          parentId: '',
          parentLabels: [],
          secondaryLabel: '(10)',
        },
        {
          id: 'GDP/B1_GA',
          isSelected: true,
          label: 'Gross domestic product/GDP: Output approach',
          parentId: '',
          parentLabels: [],
          secondaryLabel: '(2)',
        },
        {
          id: 'GDP/B1_GA/D1',
          isSelected: true,
          label:
            'Gross domestic product/GDP: Output approach/Compensation of employees',
          parentId: '',
          parentLabels: [],
          secondaryLabel: '(2)',
        },
        {
          id: 'GDP/B1_GA/D1/D1VA',
          isSelected: true,
          label:
            'Gross domestic product/GDP: Output approach/Compensation of employees/Agriculture, forestry and fishing (ISIC rev4)',
          parentId: '',
          parentLabels: [],
          secondaryLabel: '(2)',
        },
        {
          id: 'GDP/B1_GA/D1/D1VF',
          isSelected: false,
          label:
            'Gross domestic product/GDP: Output approach/Compensation of employees/Construction (ISIC rev4)',
          parentId: '',
          parentLabels: [],
          secondaryLabel: '(2)',
        },
        {
          id: 'GDP/B1_GA/D1/D1VG_I',
          isSelected: false,
          label:
            'Gross domestic product/GDP: Output approach/Compensation of employees/Distributive trade, repairs; transport; accommod., food serv. (ISIC rev4)',
          parentId: '',
          parentLabels: [],
          secondaryLabel: '(2)',
        },
      ],
    },
  ],
};

export const parentValues = {
  'OECDCS1|ECO': {
    id: 'OECDCS1|ECO',
    label: 'Economy and finance',
    count: 6,
    isSelected: false,
    parentId: '',
    parentLabels: [],
  },
  'OECDCS1|AGRI': {
    id: 'OECDCS1|AGRI',
    label: 'Agriculture and fisheries',
    count: 4,
    isSelected: false,
    parentId: '',
    parentLabels: [],
  },
  'OECDCS1|SOC': {
    id: 'OECDCS1|SOC',
    label: 'Social conditions',
    count: 4,
    isSelected: false,
    parentId: '',
    parentLabels: [],
  },
};

export const parentValuesToArray = [
  {
    id: 'OECDCS1|ECO',
    label: 'Economy and finance',
    count: 6,
    isSelected: false,
    parentId: '',
    parentLabels: [],
  },
  {
    id: 'OECDCS1|AGRI',
    label: 'Agriculture and fisheries',
    count: 4,
    isSelected: false,
    parentId: '',
    parentLabels: [],
  },
  {
    id: 'OECDCS1|SOC',
    label: 'Social conditions',
    count: 4,
    isSelected: false,
    parentId: '',
    parentLabels: [],
  },
];

export const childrenWithExistingParents = {
  'OECDCS1|ECO': {
    id: 'OECDCS1|ECO',
    label: 'Economy and finance',
    count: 6,
    isSelected: false,
    parentId: '',
    parentLabels: [],
  },
  'OECDCS1|ECO|OECDCS1|AGRI': {
    id: 'OECDCS1|ECO|OECDCS1|AGRI',
    label: 'Agriculture and fisheries',
    count: 4,
    isSelected: false,
    parentId: 'OECDCS1|ECO',
    parentLabels: ['Economy and finance'],
  },
  'OECDCS1|ECO|OECDCS1|SOC': {
    id: 'OECDCS1|ECO|OECDCS1|SOC',
    label: 'Social conditions',
    count: 4,
    isSelected: false,
    parentId: 'OECDCS1|ECO',
    parentLabels: ['Economy and finance'],
  },
};

export const childrenWithExistingParentsToArray = [
  {
    id: 'OECDCS1|ECO',
    label: 'Economy and finance',
    count: 6,
    isSelected: false,
    parentId: '',
    parentLabels: [],
  },
  {
    id: 'OECDCS1|ECO|OECDCS1|AGRI',
    label: 'Agriculture and fisheries',
    count: 4,
    isSelected: false,
    parentId: 'OECDCS1|ECO',
    parentLabels: ['Economy and finance'],
  },
  {
    id: 'OECDCS1|ECO|OECDCS1|SOC',
    label: 'Social conditions',
    count: 4,
    isSelected: false,
    parentId: 'OECDCS1|ECO',
    parentLabels: ['Economy and finance'],
  },
];

export const childrenWithNoParents = {
  'AFR|AFRRWA|AFRRWA005': {
    id: 'AFR|AFRRWA|AFRRWA005',
    label: 'East',
    count: 1,
    isSelected: false,
    parentId: 'AFR|AFRRWA',
    parentLabels: ['Africa', 'Rwanda'],
  },
  'AFR|AFRRWA|AFRRWA001': {
    id: 'AFR|AFRRWA|AFRRWA001',
    label: 'Kigali City',
    count: 1,
    isSelected: false,
    parentId: 'AFR|AFRRWA',
    parentLabels: ['Africa', 'Rwanda'],
  },
};

export const childrenWithCreatedParents = [
  {
    id: 'AFR|AFRRWA|AFRRWA005',
    label: 'East',
    count: 1,
    isSelected: false,
    parentId: 'AFR|AFRRWA',
    parentLabels: ['Africa', 'Rwanda'],
  },
  {
    id: 'AFR|AFRRWA',
    label: 'Rwanda',
    parentId: 'AFR',
    parentLabels: ['Africa'],
    isDisabled: true,
    className: 'pt-disabled',
  },
  {
    id: 'AFR',
    label: 'Africa',
    parentId: '',
    parentLabels: [],
    isDisabled: true,
    className: 'pt-disabled',
  },
  {
    id: 'AFR|AFRRWA|AFRRWA001',
    label: 'Kigali City',
    count: 1,
    isSelected: false,
    parentId: 'AFR|AFRRWA',
    parentLabels: ['Africa', 'Rwanda'],
  },
];

export const createdParents = {
  'AFR|AFRRWA': {
    id: 'AFR|AFRRWA',
    label: 'Rwanda',
    parentId: 'AFR',
    parentLabels: ['Africa'],
    isDisabled: true,
    className: 'pt-disabled',
  },
  AFR: {
    id: 'AFR',
    label: 'Africa',
    parentId: '',
    parentLabels: [],
    isDisabled: true,
    className: 'pt-disabled',
  },
};

export const groupedFacetValue = {
  dim_REF_AREA_s: [
    {
      id: 'EE',
      label: 'ESTONIA',
      count: 2,
      isSelected: false,
      parentId: '',
      parentLabels: [],
    },
    {
      id: 'FR',
      label: 'FRANCE',
      count: 2,
      isSelected: false,
      parentId: '',
      parentLabels: [],
    },
    {
      id: 'AFR',
      label: 'Africa',
      isDisabled: true,
      className: 'pt-disabled',
      parentId: '',
      parentLabels: [],
    },
    {
      id: 'CHN',
      label: 'China',
      count: 1,
      isSelected: false,
      parentId: '',
      parentLabels: [],
    },
    {
      id: 'AFRRWA',
      label: 'Rwanda',
      count: 1,
      isSelected: false,
      parentId: '',
      parentLabels: [],
    },
    {
      id: 'ES',
      label: 'SPAIN',
      count: 1,
      isSelected: false,
      parentId: '',
      parentLabels: [],
    },
    {
      id: 'TN',
      label: 'Tunisia total',
      count: 1,
      isSelected: false,
      parentId: '',
      parentLabels: [],
    },
  ],
  AFR: [
    {
      id: 'AFR|AFRRWA',
      label: 'Rwanda',
      count: 1,
      isSelected: false,
      parentId: 'AFR',
      parentLabels: ['Africa'],
    },
  ],
  'AFR|AFRRWA': [
    {
      id: 'AFR|AFRRWA|AFRRWA005',
      label: 'East',
      count: 1,
      childNodes: undefined,
      isSelected: false,
      parentId: 'AFR|AFRRWA',
      parentLabels: ['Africa', 'Rwanda'],
    },
    {
      id: 'AFR|AFRRWA|AFRRWA001',
      label: 'Kigali City',
      count: 1,
      childNodes: undefined,
      isSelected: false,
      parentId: 'AFR|AFRRWA',
      parentLabels: ['Africa', 'Rwanda'],
    },
    {
      id: 'AFR|AFRRWA|AFRRWA004',
      label: 'North',
      count: 1,
      childNodes: undefined,
      isSelected: false,
      parentId: 'AFR|AFRRWA',
      parentLabels: ['Africa', 'Rwanda'],
    },
    {
      id: 'AFR|AFRRWA|AFRRWA002',
      label: 'South',
      count: 1,
      childNodes: undefined,
      isSelected: false,
      parentId: 'AFR|AFRRWA',
      parentLabels: ['Africa', 'Rwanda'],
    },
    {
      id: 'AFR|AFRRWA|AFRRWA003',
      label: 'West',
      count: 1,
      childNodes: undefined,
      isSelected: false,
      parentId: 'AFR|AFRRWA',
      parentLabels: ['Africa', 'Rwanda'],
    },
  ],
};
