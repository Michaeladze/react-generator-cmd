import * as path from 'path';

import { updateFile } from './updateFile';

import { runLinter } from '../../src/runLinter';
import {
  IConfig,
  IConfigComponentTemplates,
  ITemplateInvoker
} from '../types/config.types';
import { IAnswersBase } from '../types/types';
import { dynamicRequire } from '../utils/dynamicRequire';
import {
  fileExists,
  mkFile
} from '../utils/mk';


export default (answers: IAnswersBase, config: IConfig) => {
  // console.log(answers);
  // console.log(config);

  config.domains[answers.$domainIndex].templates.forEach(async (templateConfig: IConfigComponentTemplates) => {
    try {
      if (templateConfig.when && !templateConfig.when(answers)) {
        return;
      }

      let name = '';

      if (typeof templateConfig.name === 'string') {
        name = templateConfig.name;
      } else {
        name = templateConfig.name(answers);
      }

      const componentsPathNext = name.includes(answers.$root) ? '' : answers.$createPath + '/';

      if (templateConfig.template) {

        const template = typeof templateConfig.template === 'string' ? templateConfig.template : templateConfig.template(answers);
        const invoker: ITemplateInvoker = dynamicRequire(path.resolve(config.variables.root, template));

        if (fileExists(`${componentsPathNext}${name}`)) {
          const updates = invoker(answers).updates;
          updateFile(`${componentsPathNext}${name}`, updates);
        } else {
          const content = invoker(answers).init;
          mkFile(`${componentsPathNext}${name}`, content);
        }
      }
    } catch (e) {
      console.log(e);
    }
  });

  runLinter(`${config.variables.root}`);
};
