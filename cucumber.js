module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['test/hooks.ts', 'src/**/*.steps.ts'],
    format: ['@cucumber/pretty-formatter'],
    paths: ['src/**/*.feature'],
    timeout: 60000,
    worldParameters: { app: null },

  },
};
