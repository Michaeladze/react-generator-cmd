import * as path from 'path';

import { runLinter } from '../../src/runLinter';
import {
  IConfig,
  IConfigComponentTemplates
} from '../types/config.types';
import { IAnswersBase } from '../types/types';
import { dynamicRequire } from '../utils/dynamicRequire';
import { mkFile } from '../utils/mk';


export default (answers: IAnswersBase, config: IConfig) => {
  // console.log(componentsPath);
  console.log(answers);
  // console.log(config);

  config.domains[answers.$domainIndex].templates.forEach(async (templateConfig: IConfigComponentTemplates) => {
    try {
      if (templateConfig.when && !templateConfig.when(answers)) {
        return;
      }

      let content = '';

      if (templateConfig.template) {
        const invoker = dynamicRequire(path.resolve(config.variables.root, templateConfig.template));
        content = invoker(answers);
      }

      let name = '';

      if (typeof templateConfig.name === 'string') {
        name = templateConfig.name;
      } else {
        name = templateConfig.name(answers);
      }

      const componentsPathNext = name.includes(answers.$root) ? '' : answers.$createPath + '/';
      mkFile(`${componentsPathNext}${name}`, content);
      runLinter(`${config.variables.root}`);
    } catch (e) {
      console.log(e);
    }
  });
};
