const baseConfig = require('./jest.config.cjs');

/** @type {import('jest').Config} */
module.exports = {
  ...baseConfig,

  testPathIgnorePatterns: [],

  testRegex: '.*\\.integration\\.spec\\.ts$',
};