import { Subject } from 'rxjs';

import {
  fileExists,
  readDirSync
} from '../mk';
import { IConfig } from '../types/config.types';
import {
  Answer,
  IAnswersBase
} from '../types/types';

export interface IGetReduxQuestions {
  prompts: Subject<any>;
  answers: IAnswersBase;
  root: string;
  config: IConfig;
}

export function getReduxQuestions({ prompts, answers, root, config }: IGetReduxQuestions) {

  const question = [
    {
      type: 'list',
      name: 'name',
      message: 'Select a reducer',
      choices: () => {
        let dir: string[] = [];
        let path = root + '/' + config.redux.folder + '/reducers';
        path = path.split('/').filter((s) => s !== '').join('/');

        if (fileExists(path)) {
          dir = readDirSync(path);
          dir = dir.map((file) => file.replace('.reducer.ts', ''));
        }

        return [Answer.CreateNew, ...dir];
      }
    },
    {
      type: 'input',
      name: 'reducer',
      message: 'How to name file?',
      when: () => answers.create === 'Redux State' && answers.name === Answer.CreateNew,
      validate: (input: string) => input !== ''
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
      when: (answers: IAnswersBase) => answers.create === 'Redux State',
      validate: (input: string) => input !== ''
    },
    {
      type: 'input',
      name: 'description',
      message: 'Description',
      when: () => answers.create === 'Redux State',
      validate: (input: string) => input !== ''
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
      validate: (input: string) => input !== ''
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
  ];

  question.forEach((q) => {
    prompts.next(q);
  });
}
