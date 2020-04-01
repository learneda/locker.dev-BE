module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier', 'import'],
  extends: [
    'airbnb-base',
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:prettier/recommended',
  ],
  rules: {
    'no-console': 1,
    'import/no-unresolved': 0,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/camelcase': 0,
    '@typescript-eslint/no-unused-vars': 0,
    'no-useless-catch': 0,
    '@typescript-eslint/member-delimiter-style': 0,
    // airbnb rules to reconsider later
    eqeqeq: 1,
    'func-names': 0,
    'no-plusplus': 0,
    'import/extensions': 0,
    'import/newline-after-import': 0,
    'object-shorthand': 0,
    'no-await-in-loop': 0,
    'no-param-reassign': 1,
    'consistent-return': 0,
    'no-restricted-syntax': 0,
    'no-unneeded-ternary': 1,
    'import/first': 1,
    'dot-notation': 1,
    'no-else-return': 1,
    'import/order': 1,
    'no-underscore-dangle': 1,
    'spaced-comment': 0,
    'guard-for-in': 1,
    'no-shadow': 1,
    'array-callback-return': 0,
    'no-unused-expressions': 0,
    'global-require': 0,
    'prefer-template': 1,
    'no-lonely-if': 1,
    'import/prefer-default-export': 0, // leave off
    '@typescript-eslint/no-explicit-any': 0,
  },
}
