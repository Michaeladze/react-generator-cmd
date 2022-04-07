const fs = require('fs');
const { exec } = require('child_process');
const { storeIndexTemplate } = require('./templates/redux');
const { reducerTemplate } = require('./templates/redux/reducers');
const { serviceTemplate } = require('./templates/redux/services');
const { effectTemplate } = require('./templates/redux/effects');
const { typesTemplate } = require('./templates/redux/types');
const { expressTemplate } = require('./templates/redux/express');
const { apiTemplate } = require('./templates/redux/api');
const { actionTemplate, commonActionsTemplate, } = require('./templates/redux/actions');
const { mkDir, mkFile } = require('./mk');
const { appendImports, insertComma } = require('./appendImports');
const { commonTypesTemplate } = require('./templates/redux/comonTypes');
const { testsTemplate } = require('./templates/redux/tests');
const { runLinter } = require('./runLinter');
const { getTestPayload } = require('./utils');

function createReduxState(answers, path) {
  if (answers.name && answers.actionName) {
    path += '/_store';
    mkDir(path);

    const name = answers.name.charAt(0).toLowerCase() + answers.name.slice(1);

    createIndex(path);
    createCommonActions(path);
    // createCommonTypes(path);
    createTypes(answers, path, name);
    // createMocks(answers, name);
    // answers.initServer && createServer(answers, name);
    createAction(answers, path, name);
    if (answers.async) {
      createEffect(answers, path, name);
      createService(answers, path, name);
    }

    if (answers.tests) {
      createTests(answers, path, name);
    }

    createReducer(answers, path, name);
    createState(answers, path, name);
    runLinter('./_store');
  } else {
    console.log('No action name was provided');
  }
}

// ---------------------------------------------------------------------------------------------------------------------

function createIndex(path) {
  const file = path + '/index.ts';
  mkFile(file, storeIndexTemplate());
}

// ---------------------------------------------------------------------------------------------------------------------

function createMocks(answers, name) {

  if (!answers.successType) {
    return;
  }

  const isArray = answers.successType.includes('[]');
  let successType = answers.successType;
  if (isArray) {
    successType = answers.successType.replace('[]', '');
  }

  const interMock = 'node ./node_modules/intermock/build/src/cli/index.js';
  const files = `--files ./src/_store/types/${ answers.name }.types.ts`;
  const interfaces = `--interfaces "${ successType }"`;
  const outputFormat = '--outputFormat json';

  const command = `${ interMock } ${ files } ${ interfaces } ${ outputFormat }`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${ error.message }`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${ stderr }`);
      return;
    }

    let path = 'backend';
    mkDir(path);

    path += '/mocks';
    mkDir(path);

    path += `/${ name }`;
    mkDir(path);

    path += `/${ answers.actionName }.json`;
    let data = JSON.stringify(JSON.parse(stdout)[successType]);

    if (isArray) {
      data = `[${ data }]`;
    }

    mkFile(path, data);
  });
}

// ---------------------------------------------------------------------------------------------------------------------

function createCommonActions(path) {
  path += '/_common';
  mkDir(path);

  path += `/actions.ts`;
  mkFile(path, commonActionsTemplate());
}

// ---------------------------------------------------------------------------------------------------------------------

function createCommonTypes(path) {
  path += '/_common';
  mkDir(path);

  path += `/types.ts`;
  mkFile(path, commonTypesTemplate());
}

// ---------------------------------------------------------------------------------------------------------------------

function createTypes(answers, path, name) {
  path += '/types';
  mkDir(path);

  path += `/${ name }.types.ts`;
  mkFile(path, typesTemplate(name, answers), () => {

    fs.readFile(path, { encoding: 'utf8' }, (err, data) => {
      const writeStream = fs.createWriteStream(path, { flags: 'a' });
      const fileData = data.split('\n');
      writeStream.write(typesTemplate(name, answers, fileData));
    });
  });
}

// ---------------------------------------------------------------------------------------------------------------------

function createAction(answers, path, name) {
  path += '/actions';
  mkDir(path);

  path += `/${ name }.actions.ts`;
  mkFile(path, actionTemplate(name, answers, true), () => {

    fs.readFile(path, { encoding: 'utf8' }, (err, data) => {
      appendImports(['types'], data, path, name, answers, () => {
        const writeStream = fs.createWriteStream(path, { flags: 'a' });
        writeStream.write(actionTemplate(name, answers));
      });
    });
  });
}

// ---------------------------------------------------------------------------------------------------------------------

function createEffect(answers, path, name) {
  path += '/effects';
  mkDir(path);

  path += `/${ name }.effects.ts`;
  mkFile(path, effectTemplate(name, path, answers, true), () => {

    fs.readFile(path, { encoding: 'utf8' }, (err, data) => {
      appendImports(['actions', 'services', 'types'], data, path, name, answers, () => {
        const writeStream = fs.createWriteStream(path, { flags: 'a' });
        writeStream.write(effectTemplate(name, path, answers));
      });
    });
  });
}

// ---------------------------------------------------------------------------------------------------------------------

function createService(answers, path, name) {
  path += '/services';
  mkDir(path);

  path += `/${ name }.services.ts`;
  mkFile(path, serviceTemplate(name, path, answers, true), () => {

    fs.readFile(path, { encoding: 'utf8' }, (err, data) => {
      appendImports(['types'], data, path, name, answers, () => {
        const writeStream = fs.createWriteStream(path, { flags: 'a' });
        writeStream.write(serviceTemplate(name, path, answers));
      });
    });

  });
}

// ---------------------------------------------------------------------------------------------------------------------

function createApi(answers, name) {
  const path = 'backend/index.js';
  mkFile(path, apiTemplate(name, answers), () => {

    fs.readFile(path, { encoding: 'utf8' }, (err, data) => {

      const lines = data.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (lines[i] === '// [NEW ENDPOINT]') {
          lines[i] = lines[i].replace('// [NEW ENDPOINT]', apiTemplate(name, answers) + '\n// [NEW ENDPOINT]');
        }
      }

      fs.writeFile(path, lines.join('\n'), (err) => {
        if (err) {
          console.log(err);
        }
      });
    });

  });
}

// ---------------------------------------------------------------------------------------------------------------------

function createReducer(answers, path, name) {
  path += '/reducers';
  mkDir(path);

  path += `/${ name }.reducer.ts`;
  mkFile(path, reducerTemplate(name, path, answers, true, true), () => {

    fs.readFile(path, { encoding: 'utf8' }, (err, data) => {
      appendImports(['actions', 'types'], data, path, name, answers, () => {

        fs.readFile(path, { encoding: 'utf8' }, (err, data) => {
          if (data) {
            const lines = data.split('\n');
            const capName = answers.name.charAt(0).toUpperCase() + answers.name.slice(1);
            const successType = answers.successType || 'any';

            for (let i = 0; i < lines.length; i++) {

              if (lines[i].includes(`export interface I${ capName }State`)) {
                let j = i;
                while (!lines[j].includes('}')) {
                  j++;
                }
                const reducerKey = answers.reducerKey ? `  ${answers.reducerKey}: ${ successType };\n` : '';
                lines[j] = lines[j].replace('}', `${ reducerKey }}`);
              }

              if (lines[i].includes('export const initialState')) {
                let j = i;
                while (!lines[j].includes('};')) {
                  j++;
                }
                const reducerKey = answers.reducerKey ? `  ${answers.reducerKey}: ${getTestPayload(successType)},\n` : '';
                lines[j] = lines[j].replace('}', `${ reducerKey }}`);
              }
            }

            fs.writeFile(path, lines.join('\n'), (err) => {
              if (err) {
                console.log(err);
              }
            });
          }
        })
      });
    });

  });
}

// ---------------------------------------------------------------------------------------------------------------------

function createState(answers, path, name) {
  const indexPath = `./src/_store/index.ts`;

  fs.readFile(indexPath, { encoding: 'utf8' }, (err, data) => {
    if (data) {
      const lines = data.split('\n');
      const capName = answers.name.charAt(0).toUpperCase() + answers.name.slice(1);
      let hasReducerImport = false;
      let hasEffectImport = false;
      // let hasServiceImport = false;

      let effectImport = `import { ${ answers.actionName }Effect$ } from './effects/${ name }.effects';\n`;
      // let serviceImport = `import { ${ answers.actionName } } from './services/${ name }.services';\n`;

      for (let i = 0; i < lines.length; i++) {

        if (lines[i].includes(`./reducers/${ name }.reducer`)) {
          hasReducerImport = true;
        }

        if (answers.async && lines[i].includes(`./effects/${ name }.effects`)) {
          hasEffectImport = true;
          insertComma(lines, i, '}');
          lines[i] = lines[i].replace('}', `${ answers.actionName }Effect$ }`);
        }

        // if (answers.async && lines[i].includes(`./services/${ name }.services`)) {
        //   hasServiceImport = true;
        //   insertComma(lines, i, '}');
        //   lines[i] = lines[i].replace('}', `${ answers.actionName } }`);
        // }

        if (lines[i].includes('[imports:end]')) {
          const reducerImport = !hasReducerImport ? `import ${ name }Reducer, { I${ capName }State } from './reducers/${ name }.reducer';\n` : '';
          if (hasEffectImport || !answers.async) {
            effectImport = '';
          }

          // if (hasServiceImport || !answers.async) {
          //   serviceImport = '';
          // }

          lines[i - 1] = lines[i - 1].replace('', `${ effectImport }${ reducerImport }`);
        }

        if (!hasReducerImport && lines[i].includes('[reducers:end]')) {
          lines[i - 1] = lines[i - 1].replace('', `  ${ name }: ${ name }Reducer, \n`);
        }

        if (answers.async && lines[i].includes('[effects:end]')) {
          lines[i - 1] = lines[i - 1].replace('', `  ${ answers.actionName }Effect$, \n`);
        }

        if (!hasReducerImport && lines[i].includes('[types:end]')) {
          lines[i - 1] = lines[i - 1].replace('', `  ${ name }: I${ capName }State; \n`);
        }

        // if (lines[i].includes('[services:end]')) {
        //   lines[i - 1] = lines[i - 1].replace('', `    ${ answers.actionName }, \n`);
        // }
      }

      fs.writeFile(indexPath, lines.join('\n'), (err) => {
        if (err) {
          console.log(err);
        }
      });
    }
  });
}

// ---------------------------------------------------------------------------------------------------------------------

function createServer(answers, name) {
  let path = 'backend';
  mkDir(path);

  path += '/index.js';
  mkFile(path, expressTemplate());
}

// ---------------------------------------------------------------------------------------------------------------------

function createTests(answers, path, name) {
  path += '/_tests';
  mkDir(path);

  path += `/${name}`;
  mkDir(path);

  path += `/${ answers.actionName }.spec.ts`;
  mkFile(path, testsTemplate(name, answers));
}

// ---------------------------------------------------------------------------------------------------------------------

module.exports = {
  createReduxState
};
