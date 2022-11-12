import * as path from 'path';

import { runLinter } from '../../src/runLinter';
import {
  IConfig,
  IConfigComponentTemplates
} from '../types/config.types';
import { IAnswersBase } from '../types/types';
import { dynamicRequire } from '../utils/dynamicRequire';
import { mkFile } from '../utils/mk';


export default (componentsPath: string, answers: IAnswersBase, config: IConfig) => {
  // console.log(componentsPath);
  // console.log(answers);
  // console.log(config);

  config.domains[answers.create].templates.forEach(async ({ name, template }: IConfigComponentTemplates) => {
    try {
      let content = '';

      if (template) {
        const invoker = dynamicRequire(path.resolve(__dirname, template));
        content = invoker(answers);
      }


      let variable = '';

      for (let i = 0; i < name.length - 1; i++) {
        if (name[i] === '$') {
          for (let j = i + 1; j < name.length; j++) {
            if (name[j] === '$') {
              variable = name.substring(i + 1, j);
              break;
            }
          }
        }
      }

      const fileName = name.replace(`$${variable}$`, answers[variable]);
      mkFile(`${componentsPath}/${fileName}`, content);
      runLinter(`${config.root}`);
    } catch (e) {
      console.log(e);
    }
  });
};
