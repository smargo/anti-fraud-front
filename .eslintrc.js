module.exports = {
  extends: [require.resolve('@umijs/lint/dist/config/eslint')],
  globals: {
    page: true,
    REACT_APP_ENV: true,
  },
  rules: {
    // 'no-unused-vars': 0,
    '@typescript-eslint/no-unused-vars': 0,
    'no-param-reassign': ['error', { props: false }],
    '@typescript-eslint/consistent-type-definitions': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    complexity: ['warn', { max: 15 }],
    'no-empty-function': ['error'],
  },
  overrides: [
    {
      files: ['*.test.js', '*.test.ts', '*.test.tsx'],
      rules: {
        '@typescript-eslint/no-unused-expressions': 'off',
      },
    },
  ],
};
