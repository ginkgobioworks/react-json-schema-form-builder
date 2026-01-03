import { defineConfig } from 'tsup';
import pkg from './package.json';

// Externalize all dependencies and peerDependencies
// They should be provided by the consuming application
const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
];

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external,
  treeshake: true,
});
