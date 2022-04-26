module.exports = [
  {
    type: 'checkbox',
    name: 'initParts',
    message: 'Init project with:',
    when: (answers => answers.create === 'Init'),
    choices: [
      {
        name: 'Router'
      },
      {
        name: 'Interceptor'
      },
      {
        name: 'Styles'
      },
      {
        name: 'Style Lint'
      },
      {
        name: 'ESLint'
      },
      {
        name: 'Husky'
      }
    ]
  }
]
