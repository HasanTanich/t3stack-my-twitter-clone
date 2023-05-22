// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

/** @type {import("eslint").Linter.Config} */
const config = {
  overrides: [
    {
      extends: [
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
      files: ['*.ts', '*.tsx'],
      parserOptions: {
        project: path.join(__dirname, 'tsconfig.json'),
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: path.join(__dirname, 'tsconfig.json'),
  },
  plugins: [
    'react',
    'react-hooks',
    '@typescript-eslint'
  ],
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended', 
    'plugin:react/recommended', 
    'plugin:react/jsx-runtime'
  ],
  rules: {
    '@typescript-eslint/consistent-type-imports': [
      'warn',
      {
        prefer: 'type-imports',
        fixStyle: 'inline-type-imports',
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      'warn', { argsIgnorePattern: '^_' }
    ],
    'indent': [
      'warn',
      2
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'always'
    ],
    'react-hooks/rules-of-hooks': 'error',
  },
};

module.exports = config;
