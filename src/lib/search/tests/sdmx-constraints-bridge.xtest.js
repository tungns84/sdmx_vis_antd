import md5 from 'md5';
import {
  searchConstraintsToVisConstraints,
  searchConstraintsToVisSelection,
  getDefaultSelection,
} from '../sdmx-constraints-bridge';

const dimensions = [
  {}, // empty dimension is possible, don't remember the usecase (cf dimitri)
  {
    id: 'MEASURE',
    index: 2,
    display: true,
    label: 'Measure',
    values: [
      {
        id: 'TOUR_TRIPS',
        label: 'Tourism trips',
        display: true,
        order: 0,
        parentId: undefined,
        position: 0,
      },
      {
        id: 'NIGHTS_ACCOM',
        label: 'Nights spent in tourism accommodation establishments',
        display: true,
        order: 0,
        parentId: undefined,
        position: 1,
      },
    ],
  },
  {
    id: 'REPORTING_COUNTRY',
    index: 0,
    display: true,
    label: 'Reporting country',
    values: [
      {
        id: 'BE',
        label: 'Belgium',
        display: true,
        order: 0,
        parentId: undefined,
        position: 7,
      },
      {
        id: 'BE3',
        label: 'Wallonia',
        display: true,
        order: 0,
        parentId: 'BE',
        position: 10,
      },
    ],
  },
  {
    id: 'FREQ',
    index: 3,
    display: true,
    label: 'Frequency',
    roles: [],
    values: [
      {
        id: 'A',
        display: true,
        label: 'Annual',
        order: 0,
        position: 0,
      },
      {
        id: 'D',
        display: true,
        label: 'Daily',
        order: 0,
        position: 0,
      },
    ],
  },
];

const constraints = {
  [md5(
    'Measure0|Nights spent in tourism accommodation establishments#NIGHTS_ACCOM#',
  )]: {
    facetId: 'Measure',
    constraintId:
      '0|Nights spent in tourism accommodation establishments#NIGHTS_ACCOM#',
  },
  [md5('Measure0|Tourism trips#TOUR_TRIPS#')]: {
    facetId: 'Measure',
    constraintId: '0|Tourism trips#TOUR_TRIPS#',
  },
  [md5('Reporting country1|Belgium#BE#|Wallonia#BE3#')]: {
    facetId: 'Reporting country',
    constraintId: '1|Belgium#BE#|Wallonia#BE3#',
  },
};

const highlightedConstraint = {
  Measure: 'Nights spent in tourism accommodation establishments',
};

const structureSelection = {
  REPORTING_COUNTRY: ['BE3', 'DE'],
  FREQ: ['A', 'B', 'C'],
};

describe('sdmx constraints bridge', () => {
  it('should prepare constraints', () => {
    expect(searchConstraintsToVisConstraints(constraints)).toEqual({
      Measure: [
        { constraintId: 'NIGHTS_ACCOM', facetId: 'Measure' },
        { constraintId: 'TOUR_TRIPS', facetId: 'Measure' },
      ],
      'Reporting country': [
        { constraintId: 'BE3', facetId: 'Reporting country' },
      ],
    });
  });

  it('should return selection from constraints', () => {
    expect(
      searchConstraintsToVisSelection(
        dimensions,
        constraints,
        highlightedConstraint,
      ),
    ).toEqual({
      MEASURE: ['NIGHTS_ACCOM', 'TOUR_TRIPS'],
      REPORTING_COUNTRY: ['BE3'],
    });
  });

  it('should return selection from constraints', () => {
    expect(getDefaultSelection(dimensions, {}, constraints)).toEqual({
      MEASURE: ['NIGHTS_ACCOM', 'TOUR_TRIPS'],
      REPORTING_COUNTRY: ['BE3'],
    });
  });

  it('should return selection from constraints and highlightedConstraints', () => {
    const constraints = {
      [md5(
        'Measure0|Nights spent in tourism accommodation establishments#NIGHTS_ACCOM#',
      )]: {
        facetId: 'Measure',
        constraintId:
          '0|Nights spent in tourism accommodation establishments#NIGHTS_ACCOM#',
      },
      [md5('Measure0|Tourism trips#TOUR_TRIPS#')]: {
        facetId: 'Measure',
        constraintId: '0|Tourism trips#TOUR_TRIPS#',
      },
    };
    const highlightedConstraint = {
      'Reporting country': 'Belgium',
    };
    expect(
      searchConstraintsToVisSelection(
        dimensions,
        constraints,
        highlightedConstraint,
      ),
    ).toEqual({
      MEASURE: ['NIGHTS_ACCOM', 'TOUR_TRIPS'],
      REPORTING_COUNTRY: ['BE'],
    });
  });

  it('should return empty selection without frequency', () => {
    const constraints = {
      '1a5729808b5014c1cb4f3aa4a2e789e6': {
        facetId: 'datasourceId',
        constraintId: 'staging:SIS-CC-stable',
      },
    };
    expect(getDefaultSelection([{}, {}], {}, constraints)).toEqual({});
  });

  it('should return structure selection consistency with dimensions', () => {
    expect(getDefaultSelection(dimensions, structureSelection, {}, {})).toEqual(
      {
        FREQ: ['A'],
        REPORTING_COUNTRY: ['BE3'],
      },
    );
  });

  it('should return selection', () => {
    const dimensions = [
      { id: 'FREQ', label: 'Frequency', values: [{ id: 'A' }] },
      {},
    ];
    const constraints = {
      '1a5729808b5014c1cb4f3aa4a2e789e6': {
        facetId: 'Frequency',
        constraintId: 'Annual#Q#',
      },
      '1a5729808b5014c1cb4f3aa4a2e789e7': {
        facetId: 'Frequency',
        constraintId: 'Annual#A#',
      },
    };
    expect(
      getDefaultSelection(dimensions, structureSelection, constraints),
    ).toEqual({
      FREQ: ['A'],
    });
    expect(getDefaultSelection(dimensions, { FREQ: ['B'] }, {})).toEqual({});
  });

  it('should return highlighted selection', () => {
    expect(
      getDefaultSelection(dimensions, {}, {}, highlightedConstraint),
    ).toEqual({
      MEASURE: ['NIGHTS_ACCOM'],
    });
  });

  it('should return constraints only without highlightedConstraint', () => {
    const constraints = {
      [md5('Measure0|Tourism trips#TOUR_TRIPS#')]: {
        facetId: 'Measure',
        constraintId: '0|Tourism trips#TOUR_TRIPS#',
      },
    };

    expect(
      getDefaultSelection(dimensions, {}, constraints, highlightedConstraint),
    ).toEqual({
      MEASURE: ['TOUR_TRIPS'],
    });
  });

  it('should return the selection without display false item or dimension', () => {
    const dimensions = [
      {
        id: 'hidden_dim',
        label: 'hidden_dim',
        display: false,
        values: [
          { id: 'NOT1', label: 'NOT1', display: false },
          { id: 'NOT2', label: 'NOT2' },
        ],
      },
      {
        id: 'dim',
        label: 'dim',
        values: [
          { id: 'D_HIDDEN', label: 'D_HIDDEN', display: false },
          { id: 'D_VISIBLE', label: 'D_VISIBLE' },
        ],
      },
      {
        id: 'MEASURE',
        display: true,
        label: 'Measure',
        values: [
          {
            id: 'TOUR_TRIPS',
            label: 'Tourism trips',
            display: false,
          },
          {
            id: 'NIGHTS_ACCOM',
            label: 'Nights spent in tourism accommodation establishments',
            display: true,
          },
        ],
      },
      {
        id: 'MEASURE1',
        display: false,
        label: 'Measure_hidden',
        values: [
          {
            id: 'TOUR_TRIPS',
            label: 'Tourism trips',
            display: true,
          },
          {
            id: 'NIGHTS_ACCOM',
            label: 'Nights spent in tourism accommodation establishments',
            display: true,
          },
        ],
      },
    ];

    const constraints = {
      [md5('Measure0|Tourism trips#TOUR_TRIPS#')]: {
        facetId: 'Measure',
        constraintId: '0|Tourism trips#TOUR_TRIPS#',
      },
      [md5('Measure_hidden0|Tourism trips#TOUR_TRIPS#')]: {
        facetId: 'Measure_hidden',
        constraintId: '0|Tourism trips#TOUR_TRIPS#',
      },
    };

    expect(
      getDefaultSelection(dimensions, {}, {}, { hidden_dim: 'NOT1' }),
    ).toEqual({});
    expect(
      getDefaultSelection(dimensions, {}, {}, { hidden_dim: 'NOT2' }),
    ).toEqual({});
    expect(
      getDefaultSelection(dimensions, {}, {}, { dim: 'D_VISIBLE' }),
    ).toEqual({
      dim: ['D_VISIBLE'],
    });
    expect(
      getDefaultSelection(dimensions, {}, {}, { dim: 'D_HIDDEN' }),
    ).toEqual({});
    expect(getDefaultSelection(dimensions, {}, constraints, {})).toEqual({});
  });
});
