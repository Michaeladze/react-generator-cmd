import inquirer from 'inquirer';

import {
  merge,
  Subject
} from 'rxjs';

import creator from './creator';
import {
  IConfig,
  IConfigComponentQuestion,
  IConfigDomain
} from './types/config.types';
import { readJSON } from './utils/readJSON';

import { validateJSON } from './utils/validateJSON';

import {
  fileExists,
  readDirSync
} from '../src/mk';
import {
  Answer,
  IAnswersBase,
  Question
} from '../src/types/types';


const prompts: any = new Subject();
const userPrompts: any = new Subject();

const config: IConfig = readJSON();
const isValidConfig = validateJSON(config);

if (!isValidConfig) {
  console.error('Invalid config');
  process.exit(0);
}

let structure: any = {};
let depth = 1;
let componentsPath = config.variables.root;
let nextKey = undefined;
let dynamicKey: unknown = undefined;

const answers: IAnswersBase = {
  $root: config.variables.root,
  $domainIndex: -1,
  $createPath: ''
};

const initialChoices: { name: string }[] = config.domains.map((d: IConfigDomain) => {
  return {
    name: d.name
  };
});

inquirer.prompt(merge(prompts, userPrompts) as any).ui.process.subscribe(
  (q) => {
    answers[q.name] = q.answer;

    // Terminate

    if (answers.$domainIndex >= 0 && config.domains) {
      if (q.name === config.domains[answers.$domainIndex].questions[config.domains[answers.$domainIndex].questions.length - 1].name) {
        userPrompts.complete();
        return;
      }
    }

    // ---

    if (q.name === Question.Create) {
      const domain = initialChoices.find(({ name }) => name === q.answer);
      answers.$domainIndex = config.domains.findIndex((d: IConfigDomain) => d.name === domain?.name);

      if (answers.$domainIndex >= 0) {
        const str = config.domains[answers.$domainIndex].structure;
        structure = !str || Object.keys(str).length === 0 ? '' : str;
      } else {
        prompts.complete();
        userPrompts.complete();
        return;
      }

      if (!config.explicit) {
        const currentKeys = Object.keys(structure);

        if (currentKeys.length === 1) {
          nextKey = currentKeys[0];
          componentsPath += `/${nextKey}`;
          structure = structure[nextKey];
        }

        if (typeof structure === 'string') {
          prompts.complete();
          config.domains[answers.$domainIndex].questions.forEach((q: IConfigComponentQuestion) => {
            userPrompts.next(q);
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

    if (keys.length === 1 && !dynamicKey && !config.explicit) {
      nextKey = keys[0];
      componentsPath += `/${nextKey}`;
      structure = structure[nextKey];
    }

    if (typeof structure === 'string') {
      prompts.complete();
      config.domains[answers.$domainIndex].questions.forEach((q: IConfigComponentQuestion) => {
        userPrompts.next(q);
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
    answers.$createPath = componentsPath;
    creator(componentsPath, answers, config);
  });

prompts.next({
  type: 'list',
  name: Question.Create,
  message: 'What needs to be created?',
  choices: initialChoices,
});
