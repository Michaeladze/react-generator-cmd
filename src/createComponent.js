const { tsxTemplate, indexTemplate, styledComponentTemplate } = require('./templates/components/component');
const { routerTemplate } = require('./templates/general/router');
const { appendRouter } = require('./appendRouter');
const { componentTestTemplate } = require('./templates/components/tests');
const { mkDir, mkFile } = require('./mk');
const { runLinter } = require('./runLinter');

function createComponent(answers, fullPath, json) {
  const pathArr = fullPath.split('/').filter((s) => s !== '' && s !== '.');
  let path = '.';

  while (pathArr.length > 1) {
    const folder = pathArr.shift();
    path += `/${ folder }`;
    mkDir(path);
  }

  const fileName = pathArr[0];
  const componentName = fileName.charAt(0).toUpperCase() + fileName.slice(1);

  path += `/${ componentName }`;
  mkDir(path);
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
    let routerPath = `${json.root}/router`;
    mkDir(routerPath);
    routerPath += '/router.tsx';
    mkFile(routerPath, routerTemplate());
    appendRouter(componentName, answers, path, routerPath);
  }

  runLinter(path);
}

module.exports = {
  createComponent
};
