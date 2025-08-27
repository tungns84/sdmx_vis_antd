// Quick test script to verify rules work
import { rules } from './lib/dotstatsuite-antd/rules/index.js';

const testData = {
  dimensions: [
    {
      id: 'COUNTRY',
      name: 'Country',
      values: [
        { id: 'US', name: 'United States' },
        { id: 'UK', name: 'United Kingdom' },
      ],
    },
    {
      id: 'TIME',
      name: 'Time',
      isTimePeriod: true,
      values: [
        { id: '2022', name: '2022' },
        { id: '2023', name: '2023' },
      ],
    },
  ],
  observations: [
    { COUNTRY: 'US', TIME: '2022', value: 100 },
    { COUNTRY: 'US', TIME: '2023', value: 110 },
    { COUNTRY: 'UK', TIME: '2022', value: 95 },
    { COUNTRY: 'UK', TIME: '2023', value: 105 },
  ],
};

const layout = {
  header: ['TIME'],
  sections: [],
  rows: ['COUNTRY'],
};

try {
  console.log('Testing rules.getTableProps...');
  const result = rules.getTableProps({
    data: testData,
    layoutIds: layout,
    customAttributes: [],
    limit: 1000,
    isTimeInverted: false,
  });
  
  console.log('✅ Success! Table props generated:');
  console.log('- Cells:', Object.keys(result.cells).length);
  console.log('- Header levels:', result.headerData.length);
  console.log('- Sections:', result.sectionsData.length);
  console.log('- Layout:', result.layout);
} catch (error) {
  console.error('❌ Error:', error);
}
