import globals from 'globals';
import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import * as mdx from 'eslint-plugin-mdx';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';
import docusaurus from '@docusaurus/eslint-plugin';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    name: 'ignore files',
    ignores: ['dist/', 'build/', '.docusaurus/', '.commitlintrc.mjs']
  },
  {
    name: 'include js/ts files',
    files: ['**/*.{js,jsx,ts,tsx,mjs,cjs}'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },
  {
    name: 'eslint js recommended',
    ...js.configs.recommended
  },
  ...tseslint.configs.recommended.map(cfg => ({
    ...cfg,
    name: `typescript: ${cfg.name || 'recommended'}`,
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { project: true }
    },
    rules: {
      ...cfg.rules,
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }]
    }
  })),
  {
    name: 'react recommended',
    files: ['**/*.{jsx,tsx}'],
    ...react.configs.flat.recommended,
    settings: { react: { version: 'detect' } }
  },
  {
    name: 'react hooks',
    files: ['**/*.{jsx,tsx}'],
    ...reactHooks.configs.flat.recommended
  },
  {
    name: 'jsx-a11y',
    files: ['**/*.{jsx,tsx}'],
    ...jsxA11y.flatConfigs.recommended
  },
  {
    name: 'docusaurus',
    files: ['**/*.{js,jsx,ts,tsx,md,mdx}'],
    rules: docusaurus.configs.recommended.rules,
    plugins: { '@docusaurus': docusaurus }
  },
  {
    name: 'mdx for .md',
    ...mdx.configs.flat
  },
  {
    name: 'custom rules',
    rules: {
      'react/prop-types': 'off',
      'prettier/prettier': 'error'
    }
  },
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    rules: {
      'react/react-in-jsx-scope': 'off'
    }
  },
  prettierRecommended
];
