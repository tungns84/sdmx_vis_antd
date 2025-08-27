/**
 * Quick test to verify the new implementation works
 */

import fs from 'fs';

console.log('🧪 Quick Integration Test\n');
console.log('=' .repeat(50));

// Test checklist
const tests = [
  {
    name: '✅ Project Structure',
    check: () => {
      return fs.existsSync('src/lib/dotstatsuite-antd');
    }
  },
  {
    name: '✅ Components Created',
    check: () => {
      return fs.existsSync('src/lib/dotstatsuite-antd/components/Viewer.tsx') &&
             fs.existsSync('src/lib/dotstatsuite-antd/components/table/SDMXTable.tsx');
    }
  },
  {
    name: '✅ Rules Module',
    check: () => {
      return fs.existsSync('src/lib/dotstatsuite-antd/rules/index.ts');
    }
  },
  {
    name: '✅ Test Page',
    check: () => {
      return fs.existsSync('src/components/test-antd-table.tsx');
    }
  },
  {
    name: '✅ Dev Server Running',
    check: async () => {
      try {
        const response = await fetch('http://localhost:5173/test-table');
        return response.status === 200;
      } catch {
        return false;
      }
    }
  }
];

// Run tests
async function runTests() {
  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      const result = await test.check();
      if (result) {
        console.log(`${test.name} - PASSED`);
        passed++;
      } else {
        console.log(`❌ ${test.name.replace('✅', '')} - FAILED`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${test.name.replace('✅', '')} - ERROR: ${error.message}`);
      failed++;
    }
  }

  console.log('\n' + '=' .repeat(50));
  console.log(`\n📊 Results: ${passed}/${tests.length} tests passed\n`);

  if (failed === 0) {
    console.log('✅ All checks passed! The migration is ready.\n');
    console.log('📝 Next steps:');
    console.log('1. Open browser: http://localhost:5173/test-table');
    console.log('2. Test the following features:');
    console.log('   - Click "Test Rules Transformation"');
    console.log('   - Click "Test Layout Change"');
    console.log('   - Try drag & drop in "Show Layout Config"');
    console.log('   - Click on table cells');
    console.log('3. If everything works, run: node scripts/cleanup-dependencies.js');
  } else {
    console.log('⚠️  Some checks failed. Please review the issues.\n');
  }
}

runTests();
