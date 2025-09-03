module.exports = {
  root: true,
  env: { browser: true, node: true },
  globals: {
    uni: 'readonly',
    getCurrentPages: 'readonly'
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/recommended',
    'plugin:prettier/recommended'
  ],
  plugins: ['vue', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    'vue/multi-word-component-names': 'off',
    'no-unused-vars': 'warn',
    'no-console': 'warn',
    'no-debugger': 'warn',
    'eqeqeq': ['error', 'always'],
    'semi': ['error', 'always'],
    'quotes': ['error', 'single'],
    // 'comma-dangle': ['error', 'always-multiline'],
    'arrow-parens': ['error', 'always'],
    'space-before-function-paren': 'off',
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    // 'indent': ['error', 2],
    'max-len': ['warn', { 'code': 200 }],
  }
};
