module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['test/hooks.ts', 'test/steps/**/*.steps.ts'],
    format: ['@cucumber/pretty-formatter','progress', 'json:reports/cucumber-report.json', 'summary'],
    'format-options': '{"snippetInterface": "async-await"}',
    paths: ['test/features/**/*.feature'],
    timeout: 60000,
    tags: '@VerifyUserToken',
    worldParameters: { app: null },
    parallel: 1

  },
};
