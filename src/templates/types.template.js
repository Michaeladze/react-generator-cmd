const { replaceParentheses, basicTypes } = require('../utils');

const typesTemplate = (name, answers, fileData) => {
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
    fileData.forEach((l) => {
      if (l.includes(pt)) {
        pendingInterface = '';
      }
      if (l.includes(st)) {
        successInterface = '';
      }
    })
  }

  return `${pendingInterface}${successInterface}`;
}

// ---------------------------------------------------------------------------------------------------------------------

module.exports = {
  typesTemplate
}
