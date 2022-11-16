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
  const file = path.resolve(__dirname, '../../../g.js');
  const GJSONExists = fileExists(file);

  if (!GJSONExists) {
    return defaultConfig;
  }

  const json = dynamicRequire(file);

  if (!json) {
    return defaultConfig;
  }

  const parsedJSON: IConfig = parseConfigQuestions(json);

  const result: IConfig = {
    ...defaultConfig,
    ...parsedJSON,
    variables: {
      ...parsedJSON.variables,
      root: path.resolve(__dirname, '../../../', parsedJSON.variables.root)
    }
  };

  return result;
}
