const { tsxTemplate, indexTemplate } = require('./templates');
const { mkDir, mkFile } = require('./mk');

function createComponent(answers, path) {
  path += '/components';
  mkDir(path);

  const componentFolder = answers.component.split(' ')[1].toLowerCase() + 's';
  path += `/${ componentFolder }`;
  mkDir(path);

  const componentName = answers.name.charAt(0).toUpperCase() + answers.name.slice(1)

  path += `/${ componentName }`;
  mkDir(path);
  mkFile(`${ path }/index.ts`, indexTemplate(componentName));
  mkFile(`${ path }/${ componentName }.tsx`, tsxTemplate(componentName, answers));
  mkFile(`${ path }/${ componentName }.scss`, '');
}

module.exports = {
  createComponent
}