const inquirer = require('inquirer');
const { mkDir, fileExists, readDirSync } = require('./mk');
const { createComponent } = require('./createComponent');
const { createReduxState } = require('./createReduxState');
const { createRouter } = require('./createRouter');
const { createInterceptor } = require('./createInterceptor');
const { createStyles } = require('./createStyles');
const { createStyleLint } = require('./createStyleLint');
const { createEsLint } = require('./createEsLint');
const { createHusky } = require('./createHusky');

inquirer
  .prompt([
    {
      type: 'list',
      name: 'package',
      message: 'What package you are working with?',
      choices: () => {
        return readDirSync('./packages');
      },
      when: () => fileExists('./lerna.json')
    },
    {
      type: 'list',
      name: 'create',
      message: 'What needs to be created?',
      choices: [
        'Component',
        'Redux State',
        'Init'
      ],
    },
    {
      type: 'list',
      name: 'component',
      message: 'What type of the component?',
      choices: [
        'Shared',
        'Feature',
        'Page',
        'Template',
        'Popup'
      ],
      when: (answers) => answers.create === 'Component'
    },
    {
      type: 'list',
      name: 'feature',
      message: 'What is the name of the feature?',
      choices: (answers) => {
        let path = './';

        if (answers.package) {
          path += `packages/${answers.package}/`;
        }

        path += 'src/components/features'

        return ['[Create New Feature]', ...readDirSync(path)];
      },
      when: (answers) => {
        if (answers.component !== 'Feature') {
          return false;
        }

        let path = './';

        if (answers.package) {
          path += `packages/${answers.package}`;
        }

        path += '/src/components';

        if (fileExists(path)) {
          path += '/features';
        }

        return fileExists(path);
      }
    },
    {
      type: 'input',
      name: 'newFeatureName',
      message: 'How do you want to call the feature?',
      when: (answers) => answers.component === 'Feature' && (answers.feature === '[Create New Feature]' || !answers.feature),
      validate: (input) => input !== ''
    },
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
    },
    {
      type: 'input',
      name: 'name',
      message: 'How to name files?',
      when: (answers => answers.create !== 'Init'),
      validate: (input) => input !== ''
    },
    {
      type: 'checkbox',
      name: 'componentOptions',
      message: 'Create component with:',
      choices: [
        {
          name: 'Dispatch and Selector'
        },
        {
          name: 'Children'
        },
        {
          name: 'useFormHook'
        },
        {
          name: 'useLocation'
        },
        {
          name: 'useHistory'
        },
        {
          name: 'useParams'
        }
      ],
      when: (answers) => answers.create === 'Component'
    },
    {
      type: 'confirm',
      name: 'tests',
      message: 'Create tests?',
      default: true,
      when: (answers) => answers.create === 'Component'
    },
    {
      type: 'confirm',
      name: 'async',
      message: 'Async?',
      when: (answers) => answers.create === 'Redux State'
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
      when: (answers) => answers.create === 'Redux State',
      validate: (input) => input !== ''
    },
    {
      type: 'input',
      name: 'pendingType',
      message: 'Pending payload type',
      when: (answers) => answers.create === 'Redux State' && answers.async
    },
    {
      type: 'input',
      name: 'successType',
      message: 'Success payload type',
      when: (answers) => answers.create === 'Redux State'
    },
    {
      type: 'input',
      name: 'reducerKey',
      message: 'Name of a key in the reducer',
      when: (answers) => answers.create === 'Redux State',
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
      when: (answers) => answers.create === 'Redux State' && answers.async
    },
    {
      type: 'confirm',
      name: 'tests',
      message: 'Create tests?',
      default: true,
      when: (answers) => answers.create === 'Redux State'
    }
  ])
  .then(answers => {
    let path = '';

    if (answers.package) {
      path += 'packages/' + answers.package;
    }

    path += (path === '' ? '.' : '') + `/src` ;
    mkDir(path);

    if (answers.create === 'Component') {
      createComponent(answers, path)
    }

    if (answers.create === 'Redux State') {
      answers.description = answers.description.charAt(0).toUpperCase() + answers.description.slice(1);
      createReduxState(answers, path);
    }

    if (answers.initParts) {
      if (answers.initParts.includes('Router')) {
        createRouter(answers, path);
      }

      if (answers.initParts.includes('Interceptor')) {
        createInterceptor(answers, path);
      }

      if (answers.initParts.includes('Styles')) {
        createStyles(answers, path);
      }

      if (answers.initParts.includes('Style Lint')) {
        createStyleLint();
      }

      if (answers.initParts.includes('ESLint')) {
        createEsLint();
      }

      if (answers.initParts.includes('Husky')) {
        createHusky();
      }
    }
  })

