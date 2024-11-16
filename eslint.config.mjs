import typescriptEslint from '@typescript-eslint/eslint-plugin';
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
    'plugin:react/recommended',
  ),
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
    },

    languageOptions: {
      globals: {
        ...globals.node,
      },

      parser: tsParser,
      ecmaVersion: 2020,
      sourceType: 'commonjs',

      parserOptions: {
        ecmaFeatures: {
          legacyDecorators: true,
          jsx: true,
        },
      },
    },

    settings: {
      react: {
        version: '18',
      },
    },

    rules: {
      'space-before-function-paren': 0,
      'react/prop-types': 0,
      'react/jsx-handler-names': 0,
      'react/jsx-fragments': 0,
      'react/no-unused-prop-types': 0,
      'import/export': 0,
      '@typescript-eslint/no-empty-function': 0,
      '@typescript-eslint/no-explicit-any': 0,
      '@typescript-eslint/no-non-null-assertion': 0,
    },
  },
];
