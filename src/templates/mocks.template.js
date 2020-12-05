const mocksTemplate = (name, answers, fileData) => {
  return `export const ${answers.actionName}Mock = {}\n\n`;
}

// ---------------------------------------------------------------------------------------------------------------------

module.exports = {
  mocksTemplate
};
