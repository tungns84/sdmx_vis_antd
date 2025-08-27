import dataflowParser from '../dataflowParser';

const dataflow = (name = 'Dropout rate') => ({
  id: 'SIS-CC-stable:DF_DROPOUT_RT',
  datasourceId: 'SIS-CC-stable',
  name,
  dataflowId: 'DF_DROPOUT_RT',
  version: '1.0',
  agencyId: 'MA_545',
  dimensions: [
    'Reference area',
    'Measure',
    'Valuation',
    'Unit of measure',
    'Time period',
  ],
});

const expectedDataflow = (name = 'Dropout <mark>rate</mark>') => ({
  id: 'SIS-CC-stable:DF_DROPOUT_RT',
  datasourceId: 'SIS-CC-stable',
  name,
  description: undefined,
  dataflowId: 'DF_DROPOUT_RT',
  version: '1.0',
  agencyId: 'MA_545',
  highlights: [
    [
      'Indicator',
      [{ label: 'Completion <mark>rate</mark>', valueId: 'EDU_COMPLETION_RT' }],
    ],
  ],
  dimensions: [
    'Reference area',
    'Measure',
    'Valuation',
    'Unit of measure',
    'Time period',
  ],
});

describe('dataflowParser', () => {
  it('should highlight name', () => {
    const highlighting = {
      'SIS-CC-stable:DF_DROPOUT_RT': {
        name: ['Dropout <mark>rate</mark>'],
        Indicator: ['0|Completion <mark>rate</mark>#EDU_COMPLETION_RT#'],
      },
    };

    expect(dataflowParser({ highlighting })(dataflow())).toEqual(
      expectedDataflow(),
    );
  });

  it('should highlight name, censuses case', () => {
    const highlighting = {
      'SIS-CC-stable:DF_DROPOUT_RT': {
        name: [' <mark>Censuses</mark> (RC, TA, DHB, SA2)'],
        Indicator: ['0|Completion <mark>rate</mark>#EDU_COMPLETION_RT#'],
      },
    };

    const name =
      'Extended family type, for extended families in occupied private dwellings, 2006, 2013, and 2018 Censuses (RC, TA, DHB, SA2)';
    const highlightedName =
      'Extended family type, for extended families in occupied private dwellings, 2006, 2013, and 2018 <mark>Censuses</mark> (RC, TA, DHB, SA2)';

    expect(dataflowParser({ highlighting })(dataflow(name))).toEqual(
      expectedDataflow(highlightedName),
    );
  });
});
