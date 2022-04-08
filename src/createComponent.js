const { tsxTemplate, indexTemplate } = require('./templates/components/component');
const { componentTestTemplate } = require('./templates/components/tests');
const { mkDir, mkFile } = require('./mk');
const { runLinter } = require('./runLinter');

function createComponent(answers, path) {
  path += '/components';
  mkDir(path);

  if (answers.design === 'Atomic Design') {
    const componentFolder = answers.component.split(' ')[1].toLowerCase() + 's';
    path += `/${ componentFolder }`;
    mkDir(path);
  } else {
    path += '/domains'
    mkDir(path);
    const tmp = answers.domain.split('');
    tmp[0] = tmp[0].toUpperCase();
    const componentFolder = tmp.join('');
    path += `/${ componentFolder }`;
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
