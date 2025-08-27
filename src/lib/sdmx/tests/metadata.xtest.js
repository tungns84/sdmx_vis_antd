import {
  getHeaderAdvancedAttributes,
  getSeriesAdvancedAttributes,
} from '../metadata';

const customAttributes = {
  flags: ['fl1', 'fl2'],
  notes: ['n1', 'n2'],
};

const combinations = [{ id: 'COMB', concepts: ['d2', 'd3', 'adv4'] }];

describe('metadata: advanced attributes parsing', () => {
  it('header advanced attributes', () => {
    const dimensions = [
      { id: 'd1', values: [{ id: 'v1' }] },
      { id: 'd2', values: [{ id: 'v1' }] },
      { id: 'd3', values: [{ id: 'v1' }] },
      { id: 'd4', values: [{ id: 'v1' }, { id: 'v2' }] },
      { id: 'd5', values: [{ id: 'v1' }, { id: 'v2' }] },
      { id: 'd6', values: [{ id: 'v1' }, { id: 'v2' }] },
    ];
    const attributes = [
      { id: 'fl1', header: true, relationship: [], values: [{ id: 'v' }] },
      { id: 'adv1', series: true, relationship: [], values: [{ id: 'v' }] },
      { id: 'adv2', header: true, relationship: [], values: [{ id: 'v' }] },
      { id: 'adv3', header: true, relationship: ['d1'], values: [{ id: 'v' }] },
      {
        id: 'adv4',
        header: true,
        relationship: ['d2', 'd3'],
        values: [{ id: 'v' }],
      },
      {
        id: 'adv5',
        header: true,
        relationship: ['d2', 'd3'],
        values: [{ id: 'v' }],
      },
      {
        id: 'adv6',
        header: true,
        relationship: ['d2', 'd3'],
        values: [{ id: 'v' }],
      },
      {
        id: 'adv6',
        header: true,
        relationship: ['d2', 'd3'],
        values: [{ id: '_Z' }],
      },
    ];

    expect(
      getHeaderAdvancedAttributes(
        attributes,
        dimensions,
        combinations,
        customAttributes,
      ),
    ).toEqual({
      '': {
        attributes: { adv2: { id: 'adv2', value: { id: 'v' } } },
        coordinates: {},
      },
      'd1=v1': {
        attributes: { adv3: { id: 'adv3', value: { id: 'v' } } },
        coordinates: { d1: 'v1' },
      },
      'd2=v1:d3=v1': {
        attributes: {
          adv5: { id: 'adv5', value: { id: 'v' } },
          adv6: { id: 'adv6', value: { id: 'v' } },
        },
        coordinates: { d2: 'v1', d3: 'v1' },
      },
    });
  });
  it('series advanced attributes', () => {
    const attributesSeries = {
      'd4=v1:d5=v2': {
        fl1: { id: 'fl1', value: 'v', coordinates: { d4: 'v1', d5: 'v2' } },
        adv4: { id: 'adv4', value: 'v', coordinates: { d4: 'v1', d5: 'v2' } },
      },
      'd4=v2:d5=v2': {
        n1: { id: 'fl1', value: 'v', coordinates: { d4: 'v2', d5: 'v2' } },
        adv5: { id: 'adv5', value: 'v', coordinates: { d4: 'v2', d5: 'v2' } },
      },
    };

    expect(
      getSeriesAdvancedAttributes(
        attributesSeries,
        combinations,
        customAttributes,
      ),
    ).toEqual({
      'd4=v2:d5=v2': {
        attributes: {
          adv5: { id: 'adv5', value: 'v', coordinates: { d4: 'v2', d5: 'v2' } },
        },
        coordinates: { d4: 'v2', d5: 'v2' },
      },
    });
  });
});
