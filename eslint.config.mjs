import { FlatCompat } from '@eslint/eslintrc';
import reactPlugin from 'eslint-plugin-react';

const compat = new FlatCompat();

const eslintConfig = [
  ...compat.extends(
    'next/core-web-vitals',
    'next/typescript',
    'plugin:react/recommended'
  ),
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      react: reactPlugin,
    },
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
      'linebreak-style': 0,
      'import/no-extraneous-dependencies': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-filename-extension': [1, { extensions: ['.jsx', '.tsx'] }],
      'react/jsx-uses-react': 'off',
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          ts: 'never',
          tsx: 'never',
          js: 'never',
          jsx: 'never',
        },
      ],
      'jsx-quotes': ['error', 'prefer-single'],
      'max-len': ['error', { code: 100 }],
      indent: ['error', 2, { SwitchCase: 1 }],
      'no-tabs': 'error',
      'react/require-default-props': 'off',
      'react/prop-types': 'off',
      'no-unused-vars': ['error', { vars: 'all', args: 'after-used', ignoreRestSiblings: false }],
      '@typescript-eslint/no-explicit-any': 'off',
      'no-multi-spaces': ['error'],
      'no-trailing-spaces': ['error'],
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1, maxBOF: 0 }],
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          ts: 'never',
          tsx: 'never',
          js: 'never',
          jsx: 'never',
          '': 'never',
        },
      ],
    },
  },
];

export default eslintConfig;