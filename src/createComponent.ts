import nodePath from 'path';

import { appendRouter } from './appendRouter';
import {
  mkDir,
  mkFile
} from './mk';
import { runLinter } from './runLinter';

import {
  tsxTemplate,
  indexTemplate,
  styledComponentTemplate
} from './templates/components/component';
import { componentTestTemplate } from './templates/components/tests';
import { routerTemplate } from './templates/general/router';
import { IConfig } from './types/config.types';
import { IAnswersBase } from './types/types';


export function createComponent(answers: IAnswersBase, path: string, json: IConfig) {
  const componentPath = path.split('/');
  componentPath[componentPath.length - 1] =
    componentPath[componentPath.length - 1].charAt(0).toUpperCase() + componentPath[componentPath.length - 1].slice(1);

  path = componentPath.join('/');

  mkDir(path);
  const componentName = answers.fileName.charAt(0).toUpperCase() + answers.fileName.slice(1);

  mkFile(`${path}/index.ts`, indexTemplate(componentName, answers, json));
  mkFile(`${path}/${componentName}.tsx`, tsxTemplate(componentName, answers, json));

  if (answers.tests) {
    const testAlias = json.testAlias || 'spec';
    mkFile(`${path}/${componentName}.${testAlias}.tsx`, componentTestTemplate(componentName, answers));
  }

  switch (json.css) {
  case 'styled':
    mkFile(`${path}/${componentName}.styled.tsx`, styledComponentTemplate(componentName, answers, json));
    break;
  case 'scss':
    mkFile(`${path}/${componentName}.scss`, '');
    break;
  case 'less':
    mkFile(`${path}/${componentName}.less`, '');
    break;
  case 'css':
    mkFile(`${path}/${componentName}.css`, '');
    break;
  default:
    mkFile(`${path}/${componentName}${json.css || '.css'}`, '');
  }

  if (json.router.pageAlias && Object.values(answers).some((v) => v === json.router.pageAlias)) {
    let routerPath = `${json.root}${json.router.path}`;
    mkDir(routerPath);

    routerPath += '/index.tsx';
    mkFile(routerPath, routerTemplate());

    const relativePath = nodePath.relative(routerPath, path).replace(/\\/g, '/');

    appendRouter(componentName, answers, relativePath, routerPath);
  }

  runLinter(`${json.root}`);
}
