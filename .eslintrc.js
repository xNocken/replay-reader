module.exports = {
  env: {
    es2020: true,
    browser: true,
    es6: true,
    node: true,
  },
  plugins: ['node', 'promise'],
  extends: ['eslint:recommended', 'prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  rules: {
    'no-console': 0,
    'no-continue': 0,
    'no-loop-func': 0,
    'no-constant-condition': 0,
    'no-unused-vars': 0,
    'no-async-promise-executor': 0,
    'semi': 2,
    'comma-dangle': ['error', 'always-multiline'],
    'max-len': [
      'error',
      {
        code: 120,
        ignoreComments: true,
        ignoreStrings: true,
        ignoreUrls: true,
        ignoreTemplateLiterals: true,
      },
    ],
  },
};
