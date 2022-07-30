import { IAnswersBase } from './types/types';

export enum BasicType {
  Number = 'number',
  String = 'string',
  Boolean = 'boolean',
  Any = 'any',
  Void = 'void',
  Null = 'null',
  Undefined = 'undefined'
}

export const basicTypes: Record<string, any> = {
  number: true,
  string: true,
  boolean: true,
  any: true,
  void: true,
  null: true,
  undefined: true
};

export const basicTypesTestPayload: Record<string, any> = {
  number: 1,
  string: '\'Test\'',
  boolean: true,
  any: true,
  void: undefined,
  null: null,
  undefined
};

export const getTestPayload = (type: string): string | undefined => {
  if (type.includes('[]')) {
    return '[]';
  }

  if (type === '') {
    return undefined;
  }

  return `${basicTypesTestPayload[type] || `{} as ${type}`}`;
};

export const replaceParentheses = (str: string): string => {
  return str.replace('[]', '');
};

export const typesImport = (name: string, answers: IAnswersBase, needPending = true, tests = false) => {
  let result = '';
  let hasPending = false;

  const pt = answers.pendingType ? replaceParentheses(answers.pendingType) : '';
  const st = answers.successType ? replaceParentheses(answers.successType) : '';

  const checkPending = !basicTypes[pt] && pt !== '';
  const checkSuccess = !basicTypes[st] && st !== '';

  if (checkPending || checkSuccess) {
    result += 'import { ';

    if (checkPending && needPending) {
      result += pt;
      hasPending = true;
    }

    if (checkSuccess) {
      if (hasPending) {
        result += ', ';
      }

      result += `${st}`;
    }

    result += ` } from '../${tests ? '../' : ''}types/${name}.types';`;
  }

  if (!needPending && !checkSuccess) {
    result = '';
  }

  return result;
};
