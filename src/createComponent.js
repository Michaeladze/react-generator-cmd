const { tsxTemplate, indexTemplate, styledComponentTemplate } = require('./templates/components/component');
const { routerTemplate } = require('./templates/general/router');
const { appendRouter } = require('./appendRouter');
const { componentTestTemplate } = require('./templates/components/tests');
const { mkDir, mkFile } = require('./mk');
const { runLinter } = require('./runLinter');
const nodePath = require('path');

function createComponent(answers, path, json, appRoot) {
  mkDir(path);
  const componentName = answers.fileName.charAt(0).toUpperCase() + answers.fileName.slice(1);

  mkFile(`${ path }/index.ts`, indexTemplate(componentName));
  mkFile(`${ path }/${ componentName }.tsx`, tsxTemplate(componentName, answers, json));

  if (answers.tests) {
    const testAlias = json.testAlias || 'spec';
    mkFile(`${ path }/${ componentName }.${ testAlias }.tsx`, componentTestTemplate(componentName, answers));
  }

  switch (json.css) {
    case 'styled':
      mkFile(`${ path }/${ componentName }.styled.tsx`, styledComponentTemplate(componentName, answers, json));
      break;
    case 'scss':
      mkFile(`${ path }/${ componentName }.scss`, '');
      break;
    case 'less':
      mkFile(`${ path }/${ componentName }.less`, '');
      break;
    default:
      mkFile(`${ path }/${ componentName }.css`, '');
  }

  if (json.router.pageAlias && Object.values(answers).some((v) => v === json.router.pageAlias)) {
    let routerPath = `${json.root}${json.router.path}`;
    mkDir(routerPath);

    routerPath += '/router.tsx';
    mkFile(routerPath, routerTemplate());

    const relativePath = nodePath.relative(routerPath, path).replace(/\\/g, '/');

    appendRouter(componentName, answers, relativePath, routerPath);
  }

  runLinter(`${json.root}`);
}

module.exports = {
  createComponent
};
