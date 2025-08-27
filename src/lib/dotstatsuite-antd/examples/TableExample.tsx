import React, { useState } from 'react';
import { Viewer } from '../components';
import { TableLayout, SDMXData } from '../types';

// Example SDMX data
const mockSDMXData: SDMXData = {
  dimensions: [
    {
      id: 'COUNTRY',
      name: 'Country',
      values: [
        { id: 'US', name: 'United States' },
        { id: 'UK', name: 'United Kingdom' },
        { id: 'JP', name: 'Japan' },
      ],
    },
    {
      id: 'INDICATOR',
      name: 'Indicator',
      values: [
        { id: 'GDP', name: 'GDP Growth' },
        { id: 'INF', name: 'Inflation Rate' },
      ],
    },
    {
      id: 'TIME_PERIOD',
      name: 'Time Period',
      isTimePeriod: true,
      values: [
        { id: '2021', name: '2021' },
        { id: '2022', name: '2022' },
        { id: '2023', name: '2023' },
      ],
    },
  ],
  observations: [
    { COUNTRY: 'US', INDICATOR: 'GDP', TIME_PERIOD: '2021', value: 5.7 },
    { COUNTRY: 'US', INDICATOR: 'GDP', TIME_PERIOD: '2022', value: 2.1 },
    { COUNTRY: 'US', INDICATOR: 'GDP', TIME_PERIOD: '2023', value: 2.5 },
    { COUNTRY: 'US', INDICATOR: 'INF', TIME_PERIOD: '2021', value: 4.7 },
    { COUNTRY: 'US', INDICATOR: 'INF', TIME_PERIOD: '2022', value: 8.0 },
    { COUNTRY: 'US', INDICATOR: 'INF', TIME_PERIOD: '2023', value: 4.0 },
    { COUNTRY: 'UK', INDICATOR: 'GDP', TIME_PERIOD: '2021', value: 7.5 },
    { COUNTRY: 'UK', INDICATOR: 'GDP', TIME_PERIOD: '2022', value: 4.1 },
    { COUNTRY: 'UK', INDICATOR: 'GDP', TIME_PERIOD: '2023', value: 0.1 },
    { COUNTRY: 'UK', INDICATOR: 'INF', TIME_PERIOD: '2021', value: 2.6 },
    { COUNTRY: 'UK', INDICATOR: 'INF', TIME_PERIOD: '2022', value: 9.1 },
    { COUNTRY: 'UK', INDICATOR: 'INF', TIME_PERIOD: '2023', value: 7.3 },
    { COUNTRY: 'JP', INDICATOR: 'GDP', TIME_PERIOD: '2021', value: 1.6 },
    { COUNTRY: 'JP', INDICATOR: 'GDP', TIME_PERIOD: '2022', value: 1.0 },
    { COUNTRY: 'JP', INDICATOR: 'GDP', TIME_PERIOD: '2023', value: 1.9 },
    { COUNTRY: 'JP', INDICATOR: 'INF', TIME_PERIOD: '2021', value: -0.2 },
    { COUNTRY: 'JP', INDICATOR: 'INF', TIME_PERIOD: '2022', value: 2.5 },
    { COUNTRY: 'JP', INDICATOR: 'INF', TIME_PERIOD: '2023', value: 3.3 },
  ],
};

const TableExample: React.FC = () => {
  const [layout, setLayout] = useState<TableLayout>({
    header: ['TIME_PERIOD'],
    sections: ['INDICATOR'],
    rows: ['COUNTRY'],
  });

  return (
    <div style={{ padding: '20px' }}>
      <h1>SDMX Table Example</h1>
      
      <Viewer
        type="table"
        tableProps={{
          data: mockSDMXData,
          layout,
          onLayoutChange: setLayout,
        }}
        headerProps={{
          title: 'Economic Indicators',
          subtitle: 'Annual data for selected countries',
        }}
        footerProps={{
          source: 'Example Data Source',
        }}
      />
    </div>
  );
};

export default TableExample;
