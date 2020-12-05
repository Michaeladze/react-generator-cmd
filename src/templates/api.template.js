const apiTemplate = (name, answers) => {
  return `
/** ${ answers.description } */
app.${answers.method.toLowerCase()}('/${answers.actionName}', (req, res) => {
  fs.readFile(__dirname + './mocks/${name}/${answers.actionName}.json', 'utf-8', (err, data) => {
    if (err) return res.error();
    return res.json(JSON.parse(data));
  })
})
`;
}

module.exports = {
  apiTemplate
}
