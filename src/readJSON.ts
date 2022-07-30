import {
  fileExists,
  readFileSync
} from './mk';
import {
  IConfig,
  IConfigCss,
  IConfigTests
} from './types/config.types';

const defaultConfig: IConfig = {
  root: './src',
  structure: {
    components: ''
  },
  css: IConfigCss.Css,
  redux: {
    folder: 'redux',
    mainApplication: '',
    registerDependents: false
  },
  testAlias: IConfigTests.Test,
  explicit: false,
  router: {
    path: '/router',
    pageAlias: 'page'
  },
  applications: ''
};

export function readJSON(): IConfig {
  const GJSONExists = fileExists('./g.json');

  if (!GJSONExists) {
    return defaultConfig;
  }

  const json = readFileSync('./g.json', {
    encoding: 'utf-8'
  });

  if (!json) {
    return defaultConfig;
  }

  const parsedJSON: IConfig = JSON.parse(json);

  const result: IConfig = {
    ...defaultConfig,
    ...parsedJSON
  };

  if (Object.keys(result.structure).length === 0) {
    result.structure = {
      components: ''
    };
  }

  result.redux = {
    ...defaultConfig.redux,
    ...result.redux
  };

  result.router = {
    ...defaultConfig.router,
    ...result.router
  };

  return result;
}
