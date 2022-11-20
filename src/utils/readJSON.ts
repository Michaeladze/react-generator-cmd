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

export async function readJSON(): Promise<IConfig> {

  const file = path.resolve('./g.js');
  logger.info(`Reading file ${file}`);
  const GJSONExists = fileExists(file);

  if (!GJSONExists) {
    logger.info('g.js not found. Using default config.');
    return defaultConfig;
  }

  const json = (await dynamicImport(file)).default;

  if (!json) {
    return defaultConfig;
  }

  const result: IConfig = {
    ...defaultConfig,
    ...json
  };

  return result;
}
