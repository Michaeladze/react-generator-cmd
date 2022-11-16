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
  const GJSONExists = fileExists('./g.js');

  if (!GJSONExists) {
    return defaultConfig;
  }

  const json = dynamicRequire('../g.js');

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
