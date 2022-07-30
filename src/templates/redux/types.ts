import { IAnswersBase } from '../../types/types';

import {
  replaceParentheses,
  basicTypes
} from '../../utils';

export const typesTemplate = (name: string, answers: IAnswersBase, fileData?: string[]) => {
  const pt = answers.pendingType ? replaceParentheses(answers.pendingType) : '';
  const st = answers.successType ? replaceParentheses(answers.successType) : '';

  const checkPending = !basicTypes[pt] && pt !== '';
  const checkSuccess = !basicTypes[st] && st !== '';

  let pendingInterface = '';
  let successInterface = '';

  if (checkPending) {
    pendingInterface = `export interface ${pt} {
}\n\n`;
  }

  if (checkSuccess) {
    successInterface = `export interface ${st} {
}\n\n`;
  }

  if (fileData) {
    fileData.forEach((l: string) => {
      if (l.includes(pt)) {
        pendingInterface = '';
      }

      if (l.includes(st)) {
        successInterface = '';
      }
    });
  }

  return `${pendingInterface}${successInterface}`;
};
