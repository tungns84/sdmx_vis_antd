import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import commonjs from 'vite-plugin-commonjs';

export default defineConfig({
  plugins: [
    react(),
    commonjs(),
    nodePolyfills({
      // Enable specific polyfills
      globals: {
        process: true,
        Buffer: true,
        global: true,
      },
      // Polyfill Node.js core modules
      protocolImports: true,
    }),
  ],
  resolve: {
    alias: {
      // Add aliases if needed
    },
  },
  define: {
    'process.env': {},
    global: 'globalThis',
  },
  optimizeDeps: {
    include: [
      '@sis-cc/dotstatsuite-sdmxjs',
      '@eyeseetea/xlsx-populate',
      'source-map-js',
      'sanitize-html',
    ],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
      include: [/node_modules/],
    },
  },
});
