import inquirer from 'inquirer';

import { Subject } from 'rxjs';

import { createComponent } from './createComponent';
import { createReduxState } from './createReduxState';
import {
  fileExists,
  readDirSync
} from './mk';
import { getReduxQuestions } from './questions/reduxObservable';
import { readJSON } from './readJSON';
import { IConfig } from './types/config.types';
import {
  Answer,
  IAnswersBase
} from './types/types';

const prompts: any = new Subject();

const json: IConfig = readJSON();
const explicit = json.explicit;
let structure = json.structure;

let depth = 1;
let componentsPath = json.root;
let nextKey = undefined;
let dynamicKey: unknown = undefined;

const answers: IAnswersBase = {};

inquirer.prompt(prompts).ui.process.subscribe(
  (q) => {
    answers[q.name] = q.answer;

    if (q.name === 'application' || q.name === 'applicationName') {
      const appName = answers.application === Answer.CreateNew ? answers.applicationName : answers.application;

      if (json.applications && appName) {
        const newRoot = `${json.root}${json.applications}/${appName}`;
        componentsPath = componentsPath.replace(json.root, newRoot);
        json.root = newRoot;
        componentsPath = componentsPath.split('/').filter((s: string) => s !== '').join('/');
      }
    }

    if (q.name === 'create') {
      if (q.answer === Answer.ReduxState) {
        getReduxQuestions(prompts, answers, componentsPath, json);
        return;
      }

      if (q.answer === Answer.Component) {

        if (!explicit) {
          const currentKeys = Object.keys(structure);

          if (currentKeys.length === 1) {
            nextKey = currentKeys[0];
            componentsPath += `/${nextKey}`;
            structure = structure[nextKey];
          }

          if (typeof structure === 'string') {
            prompts.next({
              type: 'input',
              name: 'fileName',
              message: 'How to name file?',
              validate: (input: string) => input !== ''
            });
            return;
          }
        }

        const keys = structure ? Object.keys(structure) : [];
        dynamicKey = keys.find((k) => k[0] === ':') || undefined;

        prompts.next({
          type: 'list',
          name: `components_${depth}`,
          message: 'Where to create a component?',
          choices: () => {
            if (dynamicKey) {
              let dir: string[] = [];

              if (fileExists(componentsPath)) {
                dir = readDirSync(componentsPath);
              }

              return [Answer.CreateNew, ...dir];
            }

            return Object.keys(structure);
          }
        });
      }

      return;
    }

    if (q.name === 'tests') {
      if (!json.router.pageAlias || !Object.values(answers).some((v) => v === json.router.pageAlias)) {
        prompts.complete();
      } else {
        prompts.next({
          type: 'input',
          name: 'route',
          message: 'What route?',
          validate: (input: string) => input !== '',
          when: (answers: IAnswersBase) => {
            return answers.create === Answer.Component;
          }
        });
      }

      return;
    }

    if (answers.create !== Answer.Component) {
      return;
    }

    if (q.name === 'componentOptions') {
      prompts.next({
        type: 'confirm',
        name: 'tests',
        message: 'Create tests?',
        default: true,
        when: (answers: IAnswersBase) => answers.create === Answer.Component
      });
      return;
    }

    if (q.name === 'route') {
      prompts.complete();
      return;
    }

    if (q.name === 'fileName') {
      componentsPath += `/${q.answer}`;
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
              name: 'Nested routes'
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
          when: (answers: IAnswersBase) => answers.create === Answer.Component
        }
      );
      return;
    }

    depth++;

    if (q.answer === Answer.CreateNew) {
      prompts.next({
        type: 'input',
        name: `components_${depth}`,
        message: 'How to name folder?',
        validate: (input: string) => input !== ''
      });
      return;
    }

    nextKey = dynamicKey || q.answer;
    componentsPath += `/${q.answer}`;
    structure = structure[nextKey];

    const keys = structure ? Object.keys(structure) : [];
    dynamicKey = keys.find((k) => k[0] === ':') || undefined;

    if (keys.length === 1 && !dynamicKey && !explicit) {
      nextKey = keys[0];
      componentsPath += `/${nextKey}`;
      structure = structure[nextKey];
    }

    if (typeof structure === 'string') {
      prompts.next({
        type: 'input',
        name: 'fileName',
        message: 'How to name file?',
        validate: (input: string) => input !== ''
      });
      return;
    }

    prompts.next({
      type: 'list',
      name: `components_${depth}`,
      message: 'Where to create a component?',
      choices: () => {
        if (dynamicKey) {
          let dir: string[] = [];

          if (fileExists(componentsPath)) {
            dir = readDirSync(componentsPath);
          }

          return [Answer.CreateNew, ...dir];
        }

        return Object.keys(structure);
      }
    });
  },
  (error) => {
    console.log(error);
  },
  () => {
    componentsPath = componentsPath.split('/').filter((s: string) => s !== '').join('/');

    if (answers.create === Answer.Component) {
      createComponent(answers, componentsPath, json);
    }

    if (answers.create === Answer.ReduxState) {
      answers.name = answers.name === Answer.CreateNew ? answers.reducer : answers.name;
      answers.description = answers.description.charAt(0).toUpperCase() + answers.description.slice(1);
      createReduxState(answers, componentsPath, json);
    }
  });

if (json.applications) {
  prompts.next({
    type: 'list',
    name: 'application',
    message: 'Select an application?',
    choices: () => {
      const path = `${json.root}${json.applications}`;
      let dir: string[] = [];

      if (fileExists(path)) {
        dir = readDirSync(path);
      }

      return [Answer.CreateNew, ...dir];
    }
  });

  prompts.next({
    type: 'input',
    name: 'applicationName',
    message: 'New Application name?',
    validate: (input: string) => input !== '',
    when: (answers: IAnswersBase) => answers.application === Answer.CreateNew
  });
}

prompts.next({
  type: 'list',
  name: 'create',
  message: 'What needs to be created?',
  choices: [Answer.Component, Answer.ReduxState ],
});
