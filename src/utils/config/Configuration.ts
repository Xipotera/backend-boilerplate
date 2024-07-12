/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */

import * as fs from 'fs';
import {
  ConfigurationManager,
  INewConfiguration,
} from './ConfigurationManager';
import * as path from 'node:path';

/**
 * Application configuration
 */
function createConfiguration(): INewConfiguration {
  const cm = new ConfigurationManager();
  const Conf = cm.createNewConfiguration();

  // Global configuration

  cm.setGlobalConfiguration(Conf, require('../../config/global').default);

  // Dev environment configuration
  cm.addEnvironmentConfiguration(
    Conf,
    'dev',
    require('../../config/env/dev').default,
  );

  // Test environment configuration
  cm.addEnvironmentConfiguration(
    Conf,
    'test',
    require('../../config/env/test').default,
  );

  // Production environment configuration
  cm.addEnvironmentConfiguration(
    Conf,
    'prod',
    require('../../config/env/prod').default,
  );

  const env = process.env.NODE_ENV || 'dev';

  console.info('Current ENV : ' + env);
  cm.loadEnvironment(Conf, env);

  if (
    (fs.existsSync(path.join(__dirname, '..', 'config', 'local.ts')) ||
      fs.existsSync(path.join(__dirname, '..', 'config', 'local.js'))) &&
    env !== 'test'
  ) {
    console.info('Adding local configuration ...');
    cm.applyConfiguration(Conf, require('../../config/local').default);
  } else {
    console.info('No local configuration found');
  }

  console.info('Configuration set up!');

  return Conf;
}

export const Configuration = createConfiguration();
