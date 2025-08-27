/**
 * Integration test for AntD table implementation
 */

import { rules } from '../rules';
import { SDMXData, TableLayout } from '../types';

// Test data
const testData: SDMXData = {
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
      id: 'INDICATOR',
      name: 'Indicator',
      values: [
        { id: 'GDP', name: 'GDP Growth' },
        { id: 'INF', name: 'Inflation' },
      ],
    },
    {
      id: 'TIME_PERIOD',
      name: 'Time',
      isTimePeriod: true,
      values: [
        { id: '2022', name: '2022' },
        { id: '2023', name: '2023' },
      ],
    },
  ],
  observations: [
    { COUNTRY: 'US', INDICATOR: 'GDP', TIME_PERIOD: '2022', value: 2.1 },
    { COUNTRY: 'US', INDICATOR: 'GDP', TIME_PERIOD: '2023', value: 2.5 },
    { COUNTRY: 'US', INDICATOR: 'INF', TIME_PERIOD: '2022', value: 8.0 },
    { COUNTRY: 'US', INDICATOR: 'INF', TIME_PERIOD: '2023', value: 4.0 },
    { COUNTRY: 'UK', INDICATOR: 'GDP', TIME_PERIOD: '2022', value: 4.1 },
    { COUNTRY: 'UK', INDICATOR: 'GDP', TIME_PERIOD: '2023', value: 0.1 },
    { COUNTRY: 'UK', INDICATOR: 'INF', TIME_PERIOD: '2022', value: 9.1 },
    { COUNTRY: 'UK', INDICATOR: 'INF', TIME_PERIOD: '2023', value: 7.3 },
  ],
};

const layouts: TableLayout[] = [
  {
    header: ['TIME_PERIOD'],
    sections: ['INDICATOR'],
    rows: ['COUNTRY'],
  },
  {
    header: ['COUNTRY'],
    sections: [],
    rows: ['INDICATOR', 'TIME_PERIOD'],
  },
  {
    header: ['INDICATOR', 'TIME_PERIOD'],
    sections: [],
    rows: ['COUNTRY'],
  },
];

// Test functions
function testRulesTransformation(): boolean {
  console.log('🧪 Testing rules.getTableProps...');
  
  try {
    for (let i = 0; i < layouts.length; i++) {
      const layout = layouts[i];
      console.log(`  Layout ${i + 1}: header=${layout.header}, rows=${layout.rows}`);
      
      const result = rules.getTableProps({
        data: testData,
        layoutIds: layout,
        customAttributes: [],
        limit: 1000,
        isTimeInverted: false,
      });
      
      if (!result) {
        console.error(`  ❌ Failed: returned null`);
        return false;
      }
      
      if (!result.cells || Object.keys(result.cells).length === 0) {
        console.error(`  ❌ Failed: no cells generated`);
        return false;
      }
      
      console.log(`  ✅ Success: ${Object.keys(result.cells).length} cell groups`);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error:', error);
    return false;
  }
}

function testLabelAccessor(): boolean {
  console.log('🧪 Testing label accessor...');
  
  const testCases = [
    { input: { id: 'US', name: 'United States' }, display: 'name', expected: 'United States' },
    { input: { id: 'US', name: 'United States' }, display: 'id', expected: 'US' },
    { input: { id: 'GDP' }, display: 'name', expected: 'GDP' },
  ];
  
  for (const testCase of testCases) {
    const accessor = rules.getTableLabelAccessor(testCase.display);
    const result = accessor(testCase.input);
    
    if (result !== testCase.expected) {
      console.error(`  ❌ Failed: expected "${testCase.expected}", got "${result}"`);
      return false;
    }
  }
  
  console.log('  ✅ All label accessor tests passed');
  return true;
}

function testUtilityFunctions(): boolean {
  console.log('🧪 Testing utility functions...');
  
  // Test isTimePeriodDimension
  const timeDim = testData.dimensions.find(d => d.id === 'TIME_PERIOD');
  if (!rules.isTimePeriodDimension(timeDim!)) {
    console.error('  ❌ Failed: TIME_PERIOD not recognized as time dimension');
    return false;
  }
  
  // Test getOneValueDimensions
  const oneValueDims = rules.getOneValueDimensions(testData.dimensions);
  if (oneValueDims.length !== 0) {
    console.error('  ❌ Failed: incorrect one-value dimensions');
    return false;
  }
  
  // Test getManyValueDimensions
  const manyValueDims = rules.getManyValueDimensions(testData.dimensions);
  if (manyValueDims.length !== 3) {
    console.error('  ❌ Failed: incorrect many-value dimensions');
    return false;
  }
  
  console.log('  ✅ All utility tests passed');
  return true;
}

// Run all tests
export function runIntegrationTests(): boolean {
  console.log('\n🚀 Running Integration Tests for AntD Table Implementation\n');
  console.log('=' .repeat(60));
  
  const tests = [
    { name: 'Rules Transformation', fn: testRulesTransformation },
    { name: 'Label Accessor', fn: testLabelAccessor },
    { name: 'Utility Functions', fn: testUtilityFunctions },
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    console.log(`\n${test.name}:`);
    if (test.fn()) {
      passed++;
    } else {
      failed++;
    }
  }
  
  console.log('\n' + '=' .repeat(60));
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);
  
  if (failed === 0) {
    console.log('✅ All integration tests passed! The migration is successful.\n');
    console.log('Next steps:');
    console.log('1. Test in browser: http://localhost:5173/test-table');
    console.log('2. Remove old dependencies: node scripts/cleanup-dependencies.js');
    console.log('3. Build for production: npm run build');
    return true;
  } else {
    console.log('❌ Some tests failed. Please fix the issues before proceeding.\n');
    return false;
  }
}

// Export for use in test runner
export default {
  testRulesTransformation,
  testLabelAccessor,
  testUtilityFunctions,
  runIntegrationTests,
};
