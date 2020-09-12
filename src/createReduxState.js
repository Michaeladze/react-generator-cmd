const fs = require('fs');
const { actionTemplate, effectTemplate, serviceTemplate, reducerTemplate, storeIndexTemplate } = require('./templates');
const { mkDir, mkFile } = require('./mk');
const { appendImports } = require('./appendImports');

function createReduxState(answers, path) {
  if (answers.name && answers.actionName) {
    path += '/_store';
    mkDir(path);

    const name = answers.name.charAt(0).toLowerCase() + answers.name.slice(1);

    createIndex(path);
    createAction(answers, path, name);
    if (answers.async) {
      createEffect(answers, path, name);
      createService(answers, path, name);
    }
    createReducer(answers, path, name);
    createState(answers, path, name);
  } else {
    console.log('Не указано имя файла или название экшена');
  }
}

// ---------------------------------------------------------------------------------------------------------------------

function createIndex(path) {
  const file = path + '/index.ts';
  mkFile(file, storeIndexTemplate());
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

function createReducer(answers, path, name) {
  path += '/reducers';
  mkDir(path);

  path += `/${ name }.reducer.ts`;
  mkFile(path, reducerTemplate(name, path, answers, true, true), () => {

    fs.readFile(path, { encoding: 'utf8' }, (err, data) => {
      appendImports(['actions', 'types'], data, path, name, answers);
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
      let effectImport = `import { ${ answers.actionName }Effect$ } from './effects/${ name }.effects';\n`;

      for (let i = 0; i < lines.length; i++) {

        if (lines[i].includes(`./reducers/${ name }.reducer`)) {
          hasReducerImport = true;
        }

        if (answers.async && lines[i].includes(`./effects/${ name }.effects`)) {
          hasEffectImport = true;
          lines[i] = lines[i].replace(' }', `, ${ answers.actionName }Effect$ }`);
        }

        if (lines[i].includes('[imports:end]')) {
          const reducerImport = !hasReducerImport ? `import ${ name }Reducer, { I${ capName }State } from './reducers/${ name }.reducer';\n` : '';
          if (hasEffectImport || !answers.async) {
            effectImport = '';
          }
          lines[i - 1] = lines[i - 1].replace('', `${ effectImport }${ reducerImport }`)
        }

        if (!hasReducerImport && lines[i].includes('[reducers:end]')) {
          lines[i - 1] = lines[i - 1].replace('', `  ${ name }: ${ name }Reducer, \n`)
        }

        if (answers.async &&  lines[i].includes('[effects:end]')) {
          lines[i - 1] = lines[i - 1].replace('', `  ${ answers.actionName }Effect$ \n`)
        }

        if (!hasReducerImport && lines[i].includes('[types:end]')) {
          lines[i - 1] = lines[i - 1].replace('', `  ${ name }: I${ capName }State; \n`)
        }
      }

      fs.writeFile(indexPath, lines.join('\n'), (err) => {
        if (err) {
          console.log(err)
        }
      });
    }
  });
}

module.exports = {
  createReduxState
}