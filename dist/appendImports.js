const fs = require('fs');
const { basicTypes, typesImport, reducerTemplate } = require('./templates');
const { replaceParentheses } = require('./mk');

function appendImports(types = [], data, path, name, answers, cb) {
  if (data) {
    const lines = data.split('\n');

    const isReducer = path.includes('reducer');
    const isService = path.includes('services');

    let hasTypesImports = false;

    for (let i = 0; i < lines.length; i++) {

      if (lines[i].includes(`${ name }.actions`) && types.includes('actions')) {
        if (!lines[i].includes(`${ answers.actionName }Pending }`) && !isReducer && !isService) {
          lines[i] = lines[i].replace(' }', `, ${ answers.actionName }Pending }`);
        }

        if (!lines[i].includes(`${ answers.actionName }Success }`)) {
          lines[i] = lines[i].replace(' }', `, ${ answers.actionName }${ answers.async ? 'Success' : '' } }`);
        }
      }

      // ----------

      if (answers.async && lines[i].includes(`${ name }.services`) && types.includes('services')) {
        if (!lines[i].includes(answers.actionName)) {
          lines[i] = lines[i].replace(' }', `, ${ answers.actionName } }`);
        }
      }

      // ----------

      if (types.includes('types') && lines[i].includes(`${ name }.types`)) {
        const pt = answers.pendingType && replaceParentheses(answers.pendingType);
        const st = answers.successType && replaceParentheses(answers.successType);

        hasTypesImports = true;

        if (pt && !lines[i].includes(pt) && !isReducer && !isService && !basicTypes[pt]) {
          lines[i] = lines[i].replace(' }', `, ${ pt } }`);
        }

        if (st && !lines[i].includes(st) && !basicTypes[st]) {
          lines[i] = lines[i].replace(' }', `, ${ replaceParentheses(st) } }`);
        }
      }

      // ----------

      if (isReducer && lines[i].includes('initialState')) {
        lines[i - 1] = lines[i - 1].replace(']', `  ${ reducerTemplate(name, path, answers) }\n  ]`)
      }

    }

    if (!hasTypesImports) {
      /** Ищем последний импорт и вставляем типы */

      let lastImport = -1;

      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('import')) {
          lastImport = i;
          continue;
        }

        if (lines[i].includes('export')) {
          break;
        }
      }

      const needPending = answers.pendingType && basicTypes[answers.pendingType];
      lines[lastImport] = lines[lastImport].replace(';', `;\n${typesImport(name, answers, needPending)}`);
    }


    fs.writeFile(path, lines.join('\n'), (err) => {
      if (err) {
        console.log(err)
      } else {
        cb && cb();
      }
    });
  }
}

module.exports = {
  appendImports
}