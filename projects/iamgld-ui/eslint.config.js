// @ts-check
const tseslint = require('typescript-eslint')
const rootConfig = require('../../eslint.config.js')

module.exports = tseslint.config(
  ...rootConfig,
  {
    files: ['**/*.ts'],
    extends: [],
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'gld',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'gld',
          style: 'kebab-case',
        },
      ],
    },
  },
  {
    files: ['**/*.html'],
    rules: {},
  },
)

