import * as fs from 'fs';

import {
  appendImports,
  insertComma
} from './appendImports';
import {
  mkDir,
  mkFile
} from './mk';
import { runLinter } from './runLinter';
import { storeIndexTemplate } from './templates/redux';
import {
  actionsTemplate,
  commonActionsTemplate,
} from './templates/redux/action';
import { effectTemplate } from './templates/redux/effects';
import { storeIndexMainTemplate } from './templates/redux/indexMainApp';
import { reducerTemplate } from './templates/redux/reducers';
import { serviceTemplate } from './templates/redux/services';
import { testsTemplate } from './templates/redux/tests';
import { typesTemplate } from './templates/redux/types';
import { IConfig } from './types/config.types';
import { IAnswersBase } from './types/types';
import { getTestPayload } from './utils';

export function createReduxState(answers: IAnswersBase, path: string, json: IConfig) {
  if (answers.name) {
    path += `/${json.redux.folder}`;
    mkDir(path);

    const name = answers.name.charAt(0).toLowerCase() + answers.name.slice(1);

    createIndex(answers, path, json);
    createCommonActions(path);
    createTypes(answers, path, name);
    // createMocks(answers, name);
    // answers.initServer && createServer(answers, name);
    createAction(answers, path, name);

    if (answers.async) {
      createEffect(answers, path, name);
      createService(answers, path, name);
    }

    if (answers.tests) {
      createTests(answers, path, name, json);
    }

    createReducer(answers, path, name);
    createState(answers, path, name, json);
    runLinter(`${json.root}`);
  } else {
    console.log('No action name was provided');
  }
}

// ---------------------------------------------------------------------------------------------------------------------

function createIndex(answers: IAnswersBase, path: string, json: IConfig) {
  const file = path + '/index.ts';

  if (!json.redux.mainApplication || !json.applications) {
    mkFile(file, storeIndexMainTemplate());
  } else {
    const appName = answers.application === '[Create New]' ? answers.applicationName : answers.application;

    if (appName.toLowerCase() === json.redux.mainApplication.toLowerCase()) {
      mkFile(file, storeIndexMainTemplate());
    } else {
      mkFile(file, storeIndexTemplate(json));
    }
  }
}

// ---------------------------------------------------------------------------------------------------------------------

function createCommonActions(path: string) {
  path += '/_common';
  mkDir(path);

  path += '/actions.ts';
  mkFile(path, commonActionsTemplate());
}

// ---------------------------------------------------------------------------------------------------------------------

function createTypes(answers: IAnswersBase, path: string, name: string) {
  path += '/types';
  mkDir(path);

  path += `/${name}.types.ts`;
  mkFile(path, typesTemplate(name, answers), () => {

    fs.readFile(path, {
      encoding: 'utf8'
    }, (err, data) => {
      const writeStream = fs.createWriteStream(path, {
        flags: 'a'
      });
      const fileData = data.split('\n');
      writeStream.write(typesTemplate(name, answers, fileData));
    });
  });
}

// ---------------------------------------------------------------------------------------------------------------------

function createAction(answers: IAnswersBase, path: string, name: string) {
  path += '/actions';
  mkDir(path);

  path += `/${name}.actions.ts`;
  mkFile(path, actionsTemplate(name, answers, true), () => {

    fs.readFile(path, {
      encoding: 'utf8'
    }, (err, data) => {
      appendImports(['types'], data, path, name, answers, () => {
        const writeStream = fs.createWriteStream(path, {
          flags: 'a'
        });
        writeStream.write(actionsTemplate(name, answers));
      });
    });
  });
}

// ---------------------------------------------------------------------------------------------------------------------

function createEffect(answers: IAnswersBase, path: string, name: string) {
  path += '/effects';
  mkDir(path);

  path += `/${name}.effects.ts`;
  mkFile(path, effectTemplate(name, path, answers, true), () => {

    fs.readFile(path, {
      encoding: 'utf8'
    }, (err, data) => {
      appendImports(['actions', 'services', 'types'], data, path, name, answers, () => {
        const writeStream = fs.createWriteStream(path, {
          flags: 'a'
        });
        writeStream.write(effectTemplate(name, path, answers));
      });
    });
  });
}

// ---------------------------------------------------------------------------------------------------------------------

function createService(answers: IAnswersBase, path: string, name: string) {
  path += '/services';
  mkDir(path);

  path += `/${name}.services.ts`;
  mkFile(path, serviceTemplate(name, path, answers, true), () => {

    fs.readFile(path, {
      encoding: 'utf8'
    }, (err, data) => {
      appendImports(['types'], data, path, name, answers, () => {
        const writeStream = fs.createWriteStream(path, {
          flags: 'a'
        });
        writeStream.write(serviceTemplate(name, path, answers));
      });
    });

  });
}

// ---------------------------------------------------------------------------------------------------------------------

function createReducer(answers: IAnswersBase, path: string, name: string) {
  path += '/reducers';
  mkDir(path);

  path += `/${name}.reducer.ts`;
  mkFile(path, reducerTemplate(name, path, answers, true, true), () => {

    fs.readFile(path, {
      encoding: 'utf8'
    }, (err, data) => {
      appendImports(['actions', 'types'], data, path, name, answers, () => {

        fs.readFile(path, {
          encoding: 'utf8'
        }, (err, data) => {
          if (data) {
            const lines = data.split('\n');
            const capName = answers.name.charAt(0).toUpperCase() + answers.name.slice(1);
            const successType = answers.successType || 'any';

            for (let i = 0; i < lines.length; i++) {

              if (lines[i].includes(`export interface I${capName}State`)) {
                let j = i;
                while (!lines[j].includes('}')) {
                  j++;
                }
                const reducerKey = answers.reducerKey ? `  ${answers.reducerKey}: ${successType};\n` : '';
                lines[j] = lines[j].replace('}', `${reducerKey}}`);
              }

              if (lines[i].includes('export const initialState')) {
                let j = i;
                while (!lines[j].includes('};')) {
                  j++;
                }
                const reducerKey = answers.reducerKey ? `  ${answers.reducerKey}: ${getTestPayload(successType)},\n` : '';
                lines[j] = lines[j].replace('}', `${reducerKey}}`);
              }
            }

            fs.writeFile(path, lines.join('\n'), (err) => {
              if (err) {
                console.log(err);
              }
            });
          }
        });
      });
    });

  });
}

// ---------------------------------------------------------------------------------------------------------------------

function createState(answers: IAnswersBase, path: string, name: string, json: IConfig) {
  const indexPath = `${path}/index.ts`;

  fs.readFile(indexPath, {
    encoding: 'utf8'
  }, (err, data) => {
    if (data) {
      const lines = data.split('\n');
      const capName = answers.name.charAt(0).toUpperCase() + answers.name.slice(1);
      let hasReducerImport = false;
      let hasEffectImport = false;

      const appName = answers.application === '[Create New]' ? answers.applicationName : answers.application;
      const ignoreEffectAndReducer = json.redux.mainApplication &&
        appName.toLowerCase() !== json.redux.mainApplication.toLowerCase() && !json.redux.registerDependents;

      let effectImport = ignoreEffectAndReducer ? '' : `import { ${answers.actionName}Effect$ } from './effects/${name}.effects';\n`;

      for (let i = 0; i < lines.length; i++) {

        if (lines[i].includes(`./reducers/${name}.reducer`)) {
          hasReducerImport = true;
        }

        if (answers.async && lines[i].includes(`./effects/${name}.effects`)) {
          hasEffectImport = true;
          insertComma(lines, i, '}');
          lines[i] = lines[i].replace('}', `${answers.actionName}Effect$ }`);
        }

        if (lines[i].includes('[imports:end]')) {
          const reducerImportTmp = ignoreEffectAndReducer ? 'import ' : `import ${name}Reducer, `;
          const reducerImport = !hasReducerImport ? `${reducerImportTmp}{ I${capName}State } from './reducers/${name}.reducer';\n` : '';

          if (hasEffectImport || !answers.async) {
            effectImport = '';
          }

          lines[i - 1] = lines[i - 1].replace('', `${effectImport}${reducerImport}`);
        }

        if (!ignoreEffectAndReducer && !hasReducerImport && lines[i].includes('[reducers:end]')) {
          lines[i - 1] = lines[i - 1].replace('', `  ${name}: ${name}Reducer, \n`);
        }

        if (!ignoreEffectAndReducer && answers.async && lines[i].includes('[effects:end]')) {
          lines[i - 1] = lines[i - 1].replace('', `  ${answers.actionName}Effect$, \n`);
        }

        if (!hasReducerImport && lines[i].includes('[types:end]')) {
          lines[i - 1] = lines[i - 1].replace('', `  ${name}: I${capName}State; \n`);
        }
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

function createTests(answers: IAnswersBase, path: string, name: string, json: IConfig) {
  path += '/_tests';
  mkDir(path);

  path += `/${name}`;
  mkDir(path);

  const testAlias = json.testAlias || 'spec';

  path += `/${answers.actionName}.${testAlias}.ts`;
  mkFile(path, testsTemplate(name, answers));
}
