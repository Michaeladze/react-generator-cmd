const { tsxTemplate, indexTemplate } = require('./templates/components/component');
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
  mkFile(`${ path }/${ componentName }.tsx`, tsxTemplate(componentName, answers));

  if (answers.tests) {
    const testAlias = json.testAlias || 'spec';
    mkFile(`${ path }/${ componentName }.${ testAlias }.tsx`, componentTestTemplate(componentName, answers));
  }

  mkFile(`${ path }/${ componentName }.scss`, '');

  runLinter(path);
}

module.exports = {
  createComponent
};
