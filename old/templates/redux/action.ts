import { IAnswersBase } from '../../types/types';
import { typesImport } from '../../utils';

export const actionsTemplate = (name: string, answers: IAnswersBase, imports = false) => {
  const imp = imports ? `import { createTypedAction } from 'redux-actions-ts';
${typesImport(name, answers)}` : '';

  const actions = answers.async ? `export const ${answers.actionName}Pending = createTypedAction<${answers.pendingType || 'void'}>('[Pending] ${answers.description}');
export const ${answers.actionName}Success = createTypedAction<${answers.successType || 'void'}>('[Success] ${answers.description}');` :
    `export const ${answers.actionName} = createTypedAction<${answers.successType || 'void'}>('${answers.description}');`;

  return `${imp}\n\n${actions}`;
};

// ---------------------------------------------------------------------------------------------------------------------

export const commonActionsTemplate = () => {
  return `import { createTypedAction } from 'redux-actions-ts';
import { of } from 'rxjs';

export const errorAction = createTypedAction<void>('[Error]');

export const showErrorMessage = (e: Error) => {
  console.log(e.message);
  return of(errorAction());
};`;
};
