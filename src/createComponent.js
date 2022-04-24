const { tsxTemplate, indexTemplate } = require('./templates/components/component');
const { componentTestTemplate } = require('./templates/components/tests');
const { mkDir, mkFile } = require('./mk');
const { runLinter } = require('./runLinter');

function createComponent(answers, path) {
  path += '/components';
  mkDir(path);

  const componentFolder = answers.component.toLowerCase() + (answers.component === 'Shared' ? '' : 's');
  path += `/${ componentFolder }`;
  mkDir(path);

  if (answers.feature) {
    const featureName = answers.feature.charAt(0).toUpperCase() + answers.feature.slice(1)
    path += `/${ featureName }`;
    mkDir(path);
  }

  const componentName = answers.name.charAt(0).toUpperCase() + answers.name.slice(1)

  path += `/${ componentName }`;
  mkDir(path);
  mkFile(`${ path }/index.ts`, indexTemplate(componentName));
  mkFile(`${ path }/${ componentName }.tsx`, tsxTemplate(componentName, answers));
  if (answers.tests) {
    mkFile(`${ path }/${ componentName }.spec.tsx`, componentTestTemplate(componentName, answers));
  }
  mkFile(`${ path }/${ componentName }.scss`, '');

  runLinter(path);
}

module.exports = {
  createComponent
}
