import * as path from 'path';
import { fileURLToPath } from 'url';

import { dynamicImport } from './dynamicImport';
import { logger } from './logger';
import { fileExists } from './mk';

import { IConfig } from '../types/config.types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const defaultConfig: IConfig = {
  variables: {
    root: './'
  },
  domains: []
};

export function readJSON(): IConfig {
  const location = '../';
  console.log(process.argv);
  const file = path.resolve(__dirname, 'g.js');
  logger.info(`Reading file ${file}`);
  const GJSONExists = fileExists(file);

  if (!GJSONExists) {
    logger.info('g.js not found. Using default config.');
    return defaultConfig;
  }

  const json = dynamicImport(file);

  if (!json) {
    return defaultConfig;
  }

  const result: IConfig = {
    ...defaultConfig,
    ...json
  };

  return result;
}
