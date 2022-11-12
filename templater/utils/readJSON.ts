import {
  fileExists,
  readFileSync
} from './mk';

import { parseConfigQuestions } from './parseonfigQuestions';

import { IConfig } from '../types/config.types';

const defaultConfig: IConfig = {
  root: './',
  explicit: false,
  domains: {}
};

export function readJSON(): IConfig {
  const GJSONExists = fileExists('./g2.json');

  if (!GJSONExists) {
    return defaultConfig;
  }

  const json = readFileSync('./g2.json', {
    encoding: 'utf-8'
  });

  if (!json) {
    return defaultConfig;
  }

  const parsedJSON: IConfig = parseConfigQuestions(JSON.parse(json));

  const result: IConfig = {
    ...defaultConfig,
    ...parsedJSON
  };

  return result;
}
