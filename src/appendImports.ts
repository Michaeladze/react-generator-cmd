import * as fs from 'fs';

import { reducerTemplate } from './templates/redux/reducers';
import { AnyFunction } from './types/common.types';
import { IAnswersBase } from './types/types';
import {
  basicTypes,
  replaceParentheses
} from './utils';

export function appendImports(types: string[] = [], data: string, path: string, name: string, answers: IAnswersBase, cb: AnyFunction) {
  if (data) {
    const lines = data.split('\n');

    const isReducer = path.includes('reducer');
    const isService = path.includes('services');

    let hasTypesImports = false;

    for (let i = 0; i < lines.length; i++) {

      if (lines[i].includes(`${name}.actions`) && types.includes('actions')) {
        if (!lines[i].includes(`${answers.actionName}Pending }`) && !isReducer && !isService) {
          insertComma(lines, i, '}');
          lines[i] = lines[i].replace('}', `${answers.actionName}Pending }`);
        }

        if (!lines[i].includes(`${answers.actionName}Success }`)) {
          insertComma(lines, i, '}');
          lines[i] = lines[i].replace('}', `${answers.actionName}${answers.async ? 'Success' : ''} }`);
        }
      }

      // ----------

      if (answers.async && lines[i].includes(`${name}.services`) && types.includes('services')) {
        if (!lines[i].includes(answers.actionName)) {
          insertComma(lines, i, '}');
          lines[i] = lines[i].replace('}', `${answers.actionName} }`);
        }
      }

      // ----------

      if (types.includes('types') && lines[i].includes(`${name}.types`)) {
        const pt = answers.pendingType && replaceParentheses(answers.pendingType);
        const st = answers.successType && replaceParentheses(answers.successType);

        let ptIndex = -1;
        let stIndex = -1;

        let j = i;

        while (!lines[j].includes('{')) {
          if (ptIndex !== -1 && stIndex !== -1) {
            break;
          }

          if (lines[j].includes(pt)) {
            ptIndex = j;
          }

          if (lines[j].includes(st)) {
            stIndex = j;
          }

          j--;
        }

        if (lines[j].includes(pt)) {
          ptIndex = j;
        }

        if (lines[j].includes(st)) {
          stIndex = j;
        }

        hasTypesImports = true;

        if (pt && ptIndex === -1 && !isReducer && !isService && !basicTypes[pt]) {
          insertComma(lines, i, '}');
          lines[i] = lines[i].replace('}', `${pt} }`);
        }

        if (st && stIndex === -1 && !basicTypes[st]) {
          insertComma(lines, i, '}');
          lines[i] = lines[i].replace('}', `${replaceParentheses(st)} }`);
        }
      }

      // ----------

      if (isReducer && lines[i].includes('initialState')) {
        lines[i - 1] = lines[i - 1].replace(']', `  ${reducerTemplate(name, path, answers)}\n  ]`);
      }

    }

    fs.writeFile(path, lines.join('\n'), (err) => {
      if (err) {
        console.log(err);
      } else {
        cb && cb();
      }
    });
  }
}

export function insertComma(lines: string[], i: number, beforeElement: string) {
  let index = -1;

  // [1] Ищем элемент на строке
  for (let j = 0; j < lines[i].length; j++) {
    if (lines[i][j] === beforeElement) {
      index = j;
    }
  }

  if (index < 0) {
    return;
  }

  let found = false;

  function insertCommaOnTheLine(lines: string[], i: number, index: number) {
    if (found) {
      return;
    }

    for (let j = index - 1; j >= 0; j--) {
      if (lines[i][j] === ',') {
        found = true;
        break;
      }

      if (lines[i][j] !== ' ') {
        const next = lines[i].split('');
        next[j] = next[j].replace(next[j], next[j] + ',');
        lines[i] = next.join('');
        found = true;
        break;
      }
    }
  }

  // [2] Идем в обратную сторону по той же строке и ищем место, чтобы вставить запятую
  insertCommaOnTheLine(lines, i, index);

  // [3] Если не нашли на строке, ставим запятую в конце предыдущей строки
  if (!lines[i - 1]) {
    return;
  }

  insertCommaOnTheLine(lines, i - 1, lines[i - 1].length);
}
