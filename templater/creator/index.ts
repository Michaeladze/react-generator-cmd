import * as path from 'path';

import { runLinter } from '../../src/runLinter';
import {
  IConfig,
  IConfigComponentTemplates
} from '../types/config.types';
import { IAnswersBase } from '../types/types';
import { dynamicRequire } from '../utils/dynamicRequire';
import { mkFile } from '../utils/mk';
import { setVariables } from '../utils/setVariable';


export default (componentsPath: string, answers: IAnswersBase, config: IConfig) => {
  // console.log(componentsPath);
  // console.log(answers);
  // console.log(config);

  config.domains[answers.$domainIndex].templates.forEach(async (templateConfig: IConfigComponentTemplates) => {
    try {
      if (templateConfig.condition && !templateConfig.condition(answers)) {
        return;
      }

      let content = '';

      if (templateConfig.template) {
        const invoker = dynamicRequire(path.resolve(__dirname, templateConfig.template));
        content = invoker(answers);
      }

      let name = '';

      if (typeof templateConfig.name === 'string') {
        name = templateConfig.name;
      } else {
        name = templateConfig.name(answers);
      }

      const fileName = setVariables(name, answers, config);
      const componentsPathNext = name.includes(answers.$root) ? '' : componentsPath + '/';
      mkFile(`${componentsPathNext}${fileName}`, content);
      runLinter(`${config.variables.root}`);
    } catch (e) {
      console.log(e);
    }
  });
};
