import {
  IConfig,
  IConfigVariables
} from '../types/config.types';
import {
  Characters,
  IAnswersBase
} from '../types/types';

const typeGuard = (v: string | keyof IConfigVariables, config: IConfig): v is keyof IConfigVariables => {
  return config.variables[v as keyof IConfigVariables] !== undefined;
};

export const setVariables = (path: string, answers: IAnswersBase, config: IConfig): string => {

  const variables: string[] = [];

  for (let i = 0; i < path.length - 1; i++) {
    if (path[i] === Characters.Variable) {
      for (let j = i + 1; j < path.length; j++) {
        if (path[j] === Characters.Variable) {
          variables.push(path.substring(i + 1, j));
          break;
        }
      }
    }
  }

  let result = path;

  while (variables.length > 0) {
    const variable = variables.pop();

    if (!variable) {
      return result;
    }

    const changeTo = typeGuard(variable, config) ? config.variables[variable] : answers[variable];
    result = result.replace(`$${variable}$`, changeTo);
  }

  return result;
};
