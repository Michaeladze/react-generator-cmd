const { typesImport } = require('../utils');

const actionsTemplate = (name, answers, imports = false) => {
  const imp = imports ? `import { createTypedAction } from 'redux-actions-ts';
${ typesImport(name, answers) }` : '';

  const actions = answers.async ? `export const ${ answers.actionName }Pending = createTypedAction<${ answers.pendingType || 'void' }>('[Pending] ${ answers.description }');
export const ${ answers.actionName }Success = createTypedAction<${ answers.successType || 'void' }>('[Success] ${ answers.description }');` :
    `export const ${ answers.actionName } = createTypedAction<${ answers.pendingType || 'void' }>('${ answers.description }');`

  return `${ imp }\n\n${ actions }`;
}

// ---------------------------------------------------------------------------------------------------------------------

const commonActionsTemplate = () => {
  return `import { createTypedAction } from 'redux-actions-ts';
import { of } from 'rxjs';

export const errorAction = createTypedAction<void>('[Error]');

export const showErrorMessage = (e: Error) => {
  console.log(e.message);
  return of(errorAction());
};
`
}

module.exports = {
  actionTemplate: actionsTemplate,
  commonActionsTemplate
}
