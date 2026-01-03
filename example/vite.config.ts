import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import pkg from '../package.json';

const repo = 'react-json-schema-form-builder';
const base = `/${repo}/`;

// Dedupe all dependencies and peer dependencies to avoid multiple instances
const dedupePackages = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
];

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base,
  resolve: {
    alias: {
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
      '@ginkgo-bioworks/react-json-schema-form-builder': path.resolve(
        __dirname,
        '..',
      ),
    },
    dedupe: dedupePackages,
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});

