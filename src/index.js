const inquirer = require('inquirer');
const { fileExists, readDirSync } = require('./mk');
const { createComponent } = require('./createComponent');
const { createReduxState } = require('./createReduxState')
const readGJSON = require('./_readGJSON.js');
const getReduxQuestions = require('./questions/redux.js');

// const { createRouter } = require('./createRouter');
// const { createInterceptor } = require('./createInterceptor');
// const { createStyles } = require('./createStyles');
// const { createStyleLint } = require('./createStyleLint');
// const { createEsLint } = require('./createEsLint');
// const { createHusky } = require('./createHusky');
// const initQuestions = require('./questions/init.js');

const { Subject } = require("rxjs");

const prompts = new Subject();

const json = readGJSON();
const explicit = json.explicit;
let structure = json.structure;

let depth = 1;
let componentsPath = json.root;
let nextKey = undefined;
let dynamicKey = undefined;

const answers = {};

inquirer.prompt(prompts).ui.process.subscribe(
  (q) => {
    answers[q.name] = q.answer

    if (q.name === 'create') {
      if (q.answer === 'Redux State') {
        getReduxQuestions(prompts, answers);
        return;
      }

      if (q.answer === 'Component') {

        if (!explicit) {
          const currentKeys = Object.keys(structure);
          if (currentKeys.length === 1) {
            nextKey = currentKeys[0];
            componentsPath += `/${ nextKey }`;
            structure = structure[nextKey];
          }

          if (typeof structure === "string") {
            prompts.next({
              type: 'input',
              name: `fileName`,
              message: 'How to name file?',
              validate: (input) => input !== ''
            });
            return;
          }
        }

        prompts.next({
          type: 'list',
          name: `components_${ depth }`,
          message: 'Where to create a component?',
          choices: Object.keys(structure)
        })
      }

      return;
    }

    if (q.name === 'tests') {
      prompts.complete();
      return;
    }

    if (answers.create !== 'Component') {
      return;
    }

    if (q.name === 'componentOptions') {
      prompts.next({
        type: 'confirm',
        name: 'tests',
        message: 'Create tests?',
        default: true,
        when: (answers) => answers.create === 'Component'
      });
      return;
    }

    if (q.name === 'fileName') {
      componentsPath += `/${ q.answer }`;
      prompts.next(
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
        }
      );
      return;
    }

    depth++;

    if (q.answer === '[Create New]') {
      prompts.next({
        type: 'input',
        name: `components_${ depth }`,
        message: 'How to name folder?',
        validate: (input) => input !== ''
      });
      return;
    }

    nextKey = dynamicKey || q.answer;
    componentsPath += `/${ q.answer }`;
    structure = structure[nextKey];

    const keys = structure ? Object.keys(structure) : [];
    dynamicKey = keys.find((k) => k[0] === ':') || undefined;

    if (keys.length === 1 && !dynamicKey && !explicit) {
      nextKey = keys[0];
      componentsPath += `/${ nextKey }`;
      structure = structure[nextKey];
    }

    if (typeof structure === "string") {
      prompts.next({
        type: 'input',
        name: `fileName`,
        message: 'How to name file?',
        validate: (input) => input !== ''
      });
      return;
    }

    prompts.next({
      type: 'list',
      name: `components_${ depth }`,
      message: 'Where to create a component?',
      choices: () => {
        if (dynamicKey) {
          let dir = [];
          if (fileExists(componentsPath)) {
            dir = readDirSync(componentsPath);
          }

          return [
            '[Create New]',
            ...dir
          ];
        }

        return  Object.keys(structure);
      }
    });
  },
  (error) => {
    console.log(error);
  },
  () => {
    if (answers.create === 'Component') {
      createComponent(answers, componentsPath, json);
    }

    if (answers.create === 'Redux State') {
      answers.description = answers.description.charAt(0).toUpperCase() + answers.description.slice(1);
      createReduxState(answers, componentsPath, json);
    }
  });

prompts.next({
  type: 'list',
  name: 'create',
  message: 'What needs to be created?',
  choices: [
    'Component',
    'Redux State',
  ],
});
