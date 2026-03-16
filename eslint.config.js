import js from '@eslint/js';
import globals from 'globals';
import reactPlugin from 'eslint-plugin-react';

export default [
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  js.configs.recommended,
  {
    files: ['server.js', 'api/**/*.js', 'src/**/*.{js,jsx}', 'test/**/*.js'],
    plugins: {
      react: reactPlugin,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', caughtErrors: 'none' }],
      'react/jsx-uses-vars': 'error',
    },
  },
];
