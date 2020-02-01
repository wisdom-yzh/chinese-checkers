module.exports =  {
  parser:  '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions:  {
    ecmaVersion: 6,
    sourceType: 'module',
  },
  rules: {
    'complexity': ['error', 10],
    'max-depth': ['error', 3],
    'max-lines-per-function': ['error', 50],
    'max-nested-callbacks': ['error', 3],
    '@typescript-eslint/interface-name-prefix': ['error', {'prefixWithI': 'always'}]
  }
};
