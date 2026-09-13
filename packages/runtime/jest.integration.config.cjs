const baseConfig = require('./jest.config.cjs');

/** @type {import('jest').Config} */

module.exports = {
  ...baseConfig,

  testPathIgnorePatterns: [],

  testRegex: '.*\\.integration\\.spec\\.ts$',

  //
  // Google ADK's CommonJS build depends on
  // lodash-es, which contains ESM syntax.
  //
  // Jest normally ignores node_modules during
  // transformation, so allow lodash-es through
  // the existing SWC transform.
  //
  transformIgnorePatterns: [
    '/node_modules/(?!lodash-es/)',
  ],
};