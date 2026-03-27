import typescriptEslint from '@typescript-eslint/eslint-plugin';
import eslintReact from '@eslint-react/eslint-plugin';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: [
      '**/jest.config.js',
      '**/dist/',
      '**/example/',
      '**/node_modules/',
      '**/.snapshots/',
      '**/*.min.js',
    ],
  },
  ...compat.extends(
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended',
  ),
  eslintReact.configs.recommended,
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
    },

    languageOptions: {
      globals: {
        ...globals.node,
      },

      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',

      parserOptions: {
        ecmaFeatures: {
          legacyDecorators: true,
          jsx: true,
        },
      },
    },

    rules: {
      'space-before-function-paren': 0,
      '@typescript-eslint/no-empty-function': 0,
      '@typescript-eslint/no-explicit-any': 0,
      '@typescript-eslint/no-non-null-assertion': 0,
    },
  },
  {
    files: ['**/*.test.tsx', '**/*.test.ts'],
    rules: {
      '@eslint-react/component-hook-factories': 0,
    },
  },
];
