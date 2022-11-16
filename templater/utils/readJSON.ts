import * as path from 'path';

import { dynamicRequire } from './dynamicRequire';
import { fileExists } from './mk';

import { parseConfigQuestions } from './parseConfigQuestions';

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
  console.log('\x1b[33m%s\x1b[0m', `Reading file ${file}`);
  const GJSONExists = fileExists(file);

  if (!GJSONExists) {
    console.log('\x1b[33m%s\x1b[0m', 'g.js not found. Using default config.');
    return defaultConfig;
  }

  const json = dynamicRequire(file);

  if (!json) {
    return defaultConfig;
  }

  const parsedJSON: IConfig = parseConfigQuestions(json);

  const result: IConfig = {
    ...defaultConfig,
    ...parsedJSON
  };

  return result;
}
