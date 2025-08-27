/**
 * Run integration tests for the new AntD implementation
 */

// Since we're in ESM mode, we need to dynamically import TypeScript files
async function runTests() {
  console.log('🔄 Loading test module...\n');
  
  try {
    // Import the compiled test module
    const testModule = await import('./lib/dotstatsuite-antd/test/integration.test.ts');
    
    // Run the tests
    const success = testModule.runIntegrationTests();
    
    process.exit(success ? 0 : 1);
  } catch (error) {
    console.error('❌ Failed to load test module:', error.message);
    console.log('\nMake sure TypeScript files are compiled or use tsx to run directly.');
    process.exit(1);
  }
}

runTests();
