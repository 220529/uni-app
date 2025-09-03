// eslint.config.js (使用新的扁平配置格式)
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
})

export default [
  ...compat.extends(
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:prettier/recommended'
  ),
  {
    languageOptions: {
      globals: {
        uni: 'readonly',
        getCurrentPages: 'readonly',
        plus: 'readonly',
        wx: 'readonly'
      }
    },
    rules: {
      'prettier/prettier': 'error',
      'vue/multi-word-component-names': 'off',
      'no-unused-vars': 'warn',
      'no-console': 'warn',
      'no-debugger': 'warn',
      'eqeqeq': ['error', 'always'],
      'semi': ['error', 'always'],
      'quotes': ['error', 'single'],
      'arrow-parens': ['error', 'always'],
      'space-before-function-paren': 'off',
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'max-len': ['warn', { 'code': 120 }],
    }
  }
]
