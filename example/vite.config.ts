import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const repo = 'react-json-schema-form-builder';
const base = `/${repo}/`;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base,
  resolve: {
    alias: {
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});

