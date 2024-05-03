module.exports = {
  noInlineConfig: true,
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: { project: 'tsconfig.json' },
  plugins: ['@typescript-eslint', 'simple-import-sort', 'no-relative-import-paths', 'prettier'],
  rules: {
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/explicit-member-accessibility': [
      'error',
      { overrides: { constructors: 'off' } },
    ],
    'no-relative-import-paths/no-relative-import-paths': [
      'error',
      { allowSameFolder: true, rootDir: 'src/app' },
    ],
    'no-console': 'off',
  },
};
