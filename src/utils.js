const basicTypes = {
  number: true,
  string: true,
  boolean: true,
  any: true,
  void: true,
  null: true,
  undefined: true
}

const replaceParentheses = (str) => {
  return str.replace('[]', '');
}

const typesImport = (name, answers, needPending = true) => {
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
      result += `${ st }`;
    }

    result += ` } from '../types/${ name }.types';`;
  }

  if (!needPending && !checkSuccess) {
    result = '';
  }

  return result;
}

// ---------------------------------------------------------------------------------------------------------------------


module.exports = {
  basicTypes,
  typesImport,
  replaceParentheses
}
