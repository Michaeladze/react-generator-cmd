const { tsxTemplate, indexTemplate, styledComponentTemplate } = require('./templates/components/component');
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

  if (json.css === 'styled') {
    mkFile(`${ path }/${ componentName }.styled.tsx`, styledComponentTemplate(componentName, answers, json));
  }

  if (json.css === 'css') {
    mkFile(`${ path }/${ componentName }.css`, '');
  }

  if (json.css === 'scss') {
    mkFile(`${ path }/${ componentName }.scss`, '');
  }

  if (json.css === 'less') {
    mkFile(`${ path }/${ componentName }.less`, '');
  }

  runLinter(path);
}

module.exports = {
  createComponent
};
