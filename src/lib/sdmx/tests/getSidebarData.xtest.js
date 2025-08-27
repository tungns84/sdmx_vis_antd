import { getSidebarData } from '../metadata';

describe('getSidebarData tests', () => {
  it('complete case', () => {
    const attributes = {
      '::': [
        { id: 'aa0', label: 'advanced attribute 0', value: 'value' },
        { id: 'aa1', label: 'advanced attribute 1', value: 'value' },
      ],
      '0::': [
        { id: 'aa2', label: 'advanced attribute 2', value: 'value' },
        { id: 'aa3', label: 'advanced attribute 3', value: 'value' },
      ],
    };
    const metadata = {
      '0::': [
        { id: 'ma0', label: 'metadata attribute 0', value: 'value' },
        { id: 'ma1', label: 'metadata attribute 1', value: 'value' },
      ],
      '0::0': [
        { id: 'ma2', label: 'metadata attribute 2', value: 'value' },
        { id: 'ma3', label: 'metadata attribute 3', value: 'value' },
      ],
    };
    const options = {
      display: 'code',
      attributesLabel: 'Advanced Attributes',
    };
    const dataflow = {
      id: 'DF',
      name: 'Dataflow',
    };
    const dimensions = [
      {
        id: 'd0',
        name: 'dimension 0',
        values: [{ id: 'd0v0', name: 'value 0' }],
      },
      {
        id: 'd1',
        name: 'dimension 1',
        values: [{ id: 'd1v0', name: 'value 0' }],
      },
      {
        id: 'd2',
        name: 'dimension 2',
        values: [{ id: 'd2v0', name: 'value 0' }],
      },
    ];

    expect(
      getSidebarData(attributes, metadata, dataflow, dimensions, options),
    ).toEqual([
      {
        id: '0::0',
        label: 'd0: d0v0 ● d2: d2v0',
        splitCoord: ['0', '', '0'],
        children: [
          {
            id: 'ma2',
            label: 'metadata attribute 2',
            value: 'value',
          },
          {
            id: 'ma3',
            label: 'metadata attribute 3',
            value: 'value',
          },
        ],
      },
      {
        id: '0::',
        label: 'd0: d0v0',
        splitCoord: ['0', '', ''],
        children: [
          {
            id: '0::-attr',
            label: 'Advanced Attributes',
            children: [
              {
                id: 'aa2',
                label: 'advanced attribute 2',
                value: 'value',
              },
              {
                id: 'aa3',
                label: 'advanced attribute 3',
                value: 'value',
              },
            ],
          },
          {
            id: 'ma0',
            label: 'metadata attribute 0',
            value: 'value',
          },
          {
            id: 'ma1',
            label: 'metadata attribute 1',
            value: 'value',
          },
        ],
      },
      {
        id: '::',
        label: 'DF',
        splitCoord: ['', '', ''],
        children: [
          {
            id: '::-attr',
            label: 'Advanced Attributes',
            children: [
              {
                id: 'aa0',
                label: 'advanced attribute 0',
                value: 'value',
              },
              {
                id: 'aa1',
                label: 'advanced attribute 1',
                value: 'value',
              },
            ],
          },
        ],
      },
    ]);
  });
  it('discordadnce between dimensions and metadata case', () => {
    const attributes = {
      '::': [
        { id: 'aa0', label: 'advanced attribute 0', value: 'value' },
        { id: 'aa1', label: 'advanced attribute 1', value: 'value' },
      ],
      '0::': [
        { id: 'aa2', label: 'advanced attribute 2', value: 'value' },
        { id: 'aa3', label: 'advanced attribute 3', value: 'value' },
      ],
    };
    const metadata = {
      '0::': [
        { id: 'ma0', label: 'metadata attribute 0', value: 'value' },
        { id: 'ma1', label: 'metadata attribute 1', value: 'value' },
      ],
      '0::0': [
        { id: 'ma2', label: 'metadata attribute 2', value: 'value' },
        { id: 'ma3', label: 'metadata attribute 3', value: 'value' },
      ],
    };
    const options = {
      display: 'code',
      attributesLabel: 'Advanced Attributes',
    };
    const dataflow = {
      id: 'DF',
      name: 'Dataflow',
    };
    const dimensions = [
      {
        id: 'd0',
        name: 'dimension 0',
        values: [{ id: 'd0v0', name: 'value 0' }],
      },
      {
        id: 'd1',
        name: 'dimension 1',
        values: [{ id: 'd1v0', name: 'value 0' }],
      },
    ];
    expect(
      getSidebarData(attributes, metadata, dataflow, dimensions, options),
    ).toEqual([
      {
        id: '0::',
        label: 'd0: d0v0',
        splitCoord: ['0', '', ''],
        children: [
          {
            id: '0::-attr',
            label: 'Advanced Attributes',
            children: [
              {
                id: 'aa2',
                label: 'advanced attribute 2',
                value: 'value',
              },
              {
                id: 'aa3',
                label: 'advanced attribute 3',
                value: 'value',
              },
            ],
          },
          {
            id: 'ma0',
            label: 'metadata attribute 0',
            value: 'value',
          },
          {
            id: 'ma1',
            label: 'metadata attribute 1',
            value: 'value',
          },
          {
            id: 'ma2',
            label: 'metadata attribute 2',
            value: 'value',
          },
          {
            id: 'ma3',
            label: 'metadata attribute 3',
            value: 'value',
          },
        ],
      },
      {
        id: '::',
        label: 'DF',
        splitCoord: ['', '', ''],
        children: [
          {
            id: '::-attr',
            label: 'Advanced Attributes',
            children: [
              {
                id: 'aa0',
                label: 'advanced attribute 0',
                value: 'value',
              },
              {
                id: 'aa1',
                label: 'advanced attribute 1',
                value: 'value',
              },
            ],
          },
        ],
      },
    ]);
  });
  it('non displayed dimensions handling', () => {
    const attributes = {
      '::': [
        { id: 'aa0', label: 'advanced attribute 0', value: 'value' },
        { id: 'aa1', label: 'advanced attribute 1', value: 'value' },
      ],
      '0::': [
        { id: 'aa2', label: 'advanced attribute 2', value: 'value' },
        { id: 'aa3', label: 'advanced attribute 3', value: 'value' },
      ],
    };
    const metadata = {
      '0::': [
        { id: 'ma0', label: 'metadata attribute 0', value: 'value' },
        { id: 'ma1', label: 'metadata attribute 1', value: 'value' },
      ],
      '0::0': [
        { id: 'ma2', label: 'metadata attribute 2', value: 'value' },
        { id: 'ma3', label: 'metadata attribute 3', value: 'value' },
      ],
    };
    const options = {
      display: 'code',
      attributesLabel: 'Advanced Attributes',
    };
    const dataflow = {
      id: 'DF',
      name: 'Dataflow',
    };
    const dimensions = [
      {
        id: 'd0',
        name: 'dimension 0',
        values: [{ id: 'd0v0', name: 'value 0' }],
      },
      {
        id: 'd1',
        name: 'dimension 1',
        values: [{ id: 'd1v0', name: 'value 0' }],
      },
      {
        id: 'd2',
        name: 'dimension 2',
        display: false,
        values: [{ id: 'd2v0', name: 'value 0' }],
      },
    ];

    expect(
      getSidebarData(attributes, metadata, dataflow, dimensions, options),
    ).toEqual([
      {
        id: '0::',
        label: 'd0: d0v0',
        splitCoord: ['0', '', ''],
        children: [
          {
            id: '0::-attr',
            label: 'Advanced Attributes',
            children: [
              {
                id: 'aa2',
                label: 'advanced attribute 2',
                value: 'value',
              },
              {
                id: 'aa3',
                label: 'advanced attribute 3',
                value: 'value',
              },
            ],
          },
          {
            id: 'ma0',
            label: 'metadata attribute 0',
            value: 'value',
          },
          {
            id: 'ma1',
            label: 'metadata attribute 1',
            value: 'value',
          },
          {
            id: 'ma2',
            label: 'metadata attribute 2',
            value: 'value',
          },
          {
            id: 'ma3',
            label: 'metadata attribute 3',
            value: 'value',
          },
        ],
      },
      {
        id: '::',
        label: 'DF',
        splitCoord: ['', '', ''],
        children: [
          {
            id: '::-attr',
            label: 'Advanced Attributes',
            children: [
              {
                id: 'aa0',
                label: 'advanced attribute 0',
                value: 'value',
              },
              {
                id: 'aa1',
                label: 'advanced attribute 1',
                value: 'value',
              },
            ],
          },
        ],
      },
    ]);
  });
});
