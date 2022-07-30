import nodePath from 'path';

import { appendRouter } from './appendRouter';
import {
  mkDir,
  mkFile
} from './mk';
import { runLinter } from './runLinter';

import {
  indexTemplate,
  styledComponentTemplate,
  tsxTemplate
} from './templates/components/component';
import { componentTestTemplate } from './templates/components/tests';
import { routerTemplate } from './templates/general/router';
import {
  IConfig,
  IConfigCss
} from './types/config.types';
import { IAnswersBase } from './types/types';

export function createComponent(answers: IAnswersBase, path: string, config: IConfig) {
  const componentPath = path.split('/');
  componentPath[componentPath.length - 1] =
    componentPath[componentPath.length - 1].charAt(0).toUpperCase() + componentPath[componentPath.length - 1].slice(1);

  path = componentPath.join('/');

  mkDir(path);
  const componentName = answers.fileName.charAt(0).toUpperCase() + answers.fileName.slice(1);

  mkFile(`${path}/index.ts`, indexTemplate(componentName, answers, config));
  mkFile(`${path}/${componentName}.tsx`, tsxTemplate(componentName, answers, config));

  if (answers.tests) {
    const testAlias = config.testAlias || 'spec';
    mkFile(`${path}/${componentName}.${testAlias}.tsx`, componentTestTemplate(componentName, answers));
  }

  switch (config.css) {
  case IConfigCss.Styled:
    mkFile(`${path}/${componentName}.styled.tsx`, styledComponentTemplate(componentName, answers, config));
    break;
  case IConfigCss.Scss:
    mkFile(`${path}/${componentName}.scss`, '');
    break;
  case IConfigCss.Less:
    mkFile(`${path}/${componentName}.less`, '');
    break;
  case IConfigCss.Css:
    mkFile(`${path}/${componentName}.css`, '');
    break;
  default:
    mkFile(`${path}/${componentName}${config.css || '.css'}`, '');
  }

  if (config.router.pageAlias && Object.values(answers).some((v) => v === config.router.pageAlias)) {
    let routerPath = `${config.root}${config.router.path}`;
    mkDir(routerPath);

    routerPath += '/index.tsx';
    mkFile(routerPath, routerTemplate());

    const relativePath = nodePath.relative(routerPath, path).replace(/\\/g, '/');

    appendRouter(componentName, answers, relativePath, routerPath);
  }

  runLinter(`${config.root}`);
}
