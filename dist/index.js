const inquirer = require('inquirer');
const { mkDir } = require('./mk');
const { createComponent } = require('./createComponent');
const { createReduxState } = require('./createReduxState');
const { createRouter } = require('./createRouter');

inquirer
  .prompt([
    {
      type: 'list',
      name: 'create',
      message: 'Что нужно создать?',
      choices: [
        'Component',
        'Redux State',
        'Router'
      ],
    },
    {
      type: 'list',
      name: 'component',
      message: 'Что нужно создать?',
      choices: [
        '🔬 Atom',
        '🧬 Molecule',
        '🦍 Organism',
        '📄 Page',
        '✏️ Template',
        '🎆 Popup'
      ],
      when: (answers) => answers.create === 'Component'
    },
    {
      type: 'input',
      name: 'name',
      message: 'Как назвать файлы?',
      when: (answers => answers.create !== 'Router')
    },
    {
      type: 'checkbox',
      name: 'componentOptions',
      message: 'Что добавить в компонент?',
      choices: [
        {
          name: 'Redux'
        },
        {
          name: 'Children'
        },
        {
          name: 'useReactiveForm'
        },
        {
          name: 'useLocation'
        },
        {
          name: 'useHistory'
        }
      ],
      when: (answers) => answers.create === 'Component'
    },
    {
      type: 'confirm',
      name: 'async',
      message: 'Асинхронный?',
      when: (answers) => answers.create === 'Redux State'
    },
    {
      type: 'input',
      name: 'actionName',
      message: 'Как назвать экшены?',
      when: (answers) => answers.create === 'Redux State'
    },
    {
      type: 'input',
      name: 'description',
      message: 'Описание',
      when: (answers) => answers.create === 'Redux State'
    },
    {
      type: 'input',
      name: 'pendingType',
      message: 'Интерфейс на вход',
      when: (answers) => answers.create === 'Redux State'
    },
    {
      type: 'input',
      name: 'successType',
      message: 'Интерфейс на выход',
      when: (answers) => answers.create === 'Redux State' && answers.async
    }
  ])
  .then(answers => {
    let path = `./src`;
    mkDir(path);

    if (answers.create === 'Component') {
      createComponent(answers, path);
    }

    if (answers.create === 'Redux State') {
      answers.description = answers.description.charAt(0).toUpperCase() + answers.description.slice(1);
      createReduxState(answers, path);
    }

    if (answers.create === 'Router') {
      createRouter(answers, path);
    }
  })

