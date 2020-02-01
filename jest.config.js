module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  testPathIgnorePatterns: ['/lib/', '/node_modules/'],
  moduleFileExtensions: ['ts', 'js'],
  collectCoverageFrom: ['packages/**/src/**/*.ts', '!**/node_modules/**'],
  globals: {
    'ts-jest': {
      tsConfig: './tsconfig.json',
    },
  },
};
