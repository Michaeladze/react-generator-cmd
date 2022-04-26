function getReduxQuestions(prompts, answers) {

  const question = [
    {
      type: 'input',
      name: 'name',
      message: 'How to name file?',
      when: () => answers.create === 'Redux State',
      validate: (input) => input !== ''
    },
    {
      type: 'confirm',
      name: 'async',
      message: 'Async?',
      when: () => answers.create === 'Redux State'
    },
    {
      type: 'input',
      name: 'actionName',
      message: 'How to name Actions?',
      when: (answers) => answers.create === 'Redux State',
      validate: (input) => input !== ''
    },
    {
      type: 'input',
      name: 'description',
      message: 'Description',
      when: () => answers.create === 'Redux State',
      validate: (input) => input !== ''
    },
    {
      type: 'input',
      name: 'pendingType',
      message: 'Pending payload type',
      when: () => answers.create === 'Redux State' && answers.async
    },
    {
      type: 'input',
      name: 'successType',
      message: 'Success payload type',
      when: () => answers.create === 'Redux State'
    },
    {
      type: 'input',
      name: 'reducerKey',
      message: 'Name of a key in the reducer',
      when: () => answers.create === 'Redux State',
      validate: (input) => input !== ''
    },
    {
      type: 'list',
      name: 'method',
      message: 'What is the method of the service?',
      choices: [
        'GET',
        'POST',
        'PUT',
        'DELETE'
      ],
      when: () => answers.create === 'Redux State' && answers.async
    },
    {
      type: 'confirm',
      name: 'tests',
      message: 'Create tests?',
      default: true,
      when: () => answers.create === 'Redux State'
    }
  ]

  question.forEach((q) => {
    prompts.next(q);
  })
}

module.exports = getReduxQuestions
