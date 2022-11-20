import * as path from 'path';

import { dynamicRequire } from './dynamicRequire';
import { logger } from './logger';
import { fileExists } from './mk';

import { IConfig } from '../types/config.types';

const defaultConfig: IConfig = {
  variables: {
    root: './'
  },
  domains: []
};

export function readJSON(): IConfig {
  const location = '../../../';
  const file = path.resolve(__dirname, location, 'g.js');
  logger.info(`Reading file ${file}`);
  const GJSONExists = fileExists(file);

  if (!GJSONExists) {
    logger.info('g.js not found. Using default config.');
    return defaultConfig;
  }

  const json = dynamicRequire(file);

  if (!json) {
    return defaultConfig;
  }

  const result: IConfig = {
    ...defaultConfig,
    ...json
  };

  return result;
}
