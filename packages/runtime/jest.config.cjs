/** @type {import('jest').Config} */
module.exports = {
  rootDir: 'src',

  testRegex: '.*\\.spec\\.ts$',

  moduleFileExtensions: [
    'ts',
    'js',
    'json',
  ],

  transform: {
    '^.+\\.(t|j)s$': [
      '@swc/jest',
    ],
  },

  testEnvironment: 'node',

  modulePathIgnorePatterns: [
    '<rootDir>/../dist',
  ],

  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};