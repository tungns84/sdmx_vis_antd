// Wrapper to handle CommonJS/ESM compatibility for xlsx-populate
let XlsxPopulate;

try {
  // Try to import as ESM
  const module = import('@eyeseetea/xlsx-populate');
  XlsxPopulate = module.default || module;
} catch {
  // Fallback to require for CommonJS
  XlsxPopulate = require('@eyeseetea/xlsx-populate');
}

// For Vite, we need to handle the module differently
if (typeof import.meta !== 'undefined' && import.meta.env) {
  // In Vite environment
  import('@eyeseetea/xlsx-populate').then(module => {
    XlsxPopulate = module.default || module.XlsxPopulate || module;
  });
}

export default XlsxPopulate;
