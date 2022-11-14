import * as path from 'path';

import { runLinter } from '../../src/runLinter';
import {
  IConfig,
  IConfigComponentTemplates
} from '../types/config.types';
import {
  IAnswersBase,
  Reserved
} from '../types/types';
import { dynamicRequire } from '../utils/dynamicRequire';
import { mkFile } from '../utils/mk';
import { setVariables } from '../utils/setVariable';


export default (componentsPath: string, answers: IAnswersBase, config: IConfig) => {
  // console.log(componentsPath);
  // console.log(answers);
  // console.log(config);

  config.domains[answers.__domainIndex].templates.forEach(async ({ name, template }: IConfigComponentTemplates) => {
    try {
      let content = '';

      if (template) {
        const invoker = dynamicRequire(path.resolve(__dirname, template));
        content = invoker(answers);
      }

      const fileName = setVariables(name, answers, config);
      const componentsPathNext = name.includes(Reserved.Root) ? '' : componentsPath + '/';
      mkFile(`${componentsPathNext}${fileName}`, content);
      runLinter(`${config.variables.root}`);
    } catch (e) {
      console.log(e);
    }
  });
};
