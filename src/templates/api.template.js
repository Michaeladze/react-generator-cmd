const apiTemplate = (name, answers) => {
  return `
/** ${ answers.description } */
app.${answers.method.toLowerCase()}('/${answers.actionName}', (req, res) => {
  fs.readFile('./mocks/${name}/${answers.actionName}.json', 'utf-8', (err, data) => {
    if (err) return res.error();
    return res.json(data);
  })
})
`;
}

module.exports = {
  apiTemplate
}
