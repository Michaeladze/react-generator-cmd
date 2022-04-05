const { typesImport, getTestPayload } = require('../../utils');

const reducerTemplate = (name, path, answers, imports = false, init = false) => {
  const imp = imports ? `import { Action } from 'redux-actions';
import { createTypedHandler, handleTypedActions } from 'redux-actions-ts';
${ typesImport(name, answers, false) }
import { ${ answers.actionName }${ answers.async ? 'Success' : '' } } from '../actions/${ name }.actions';` : '';

  const capName = answers.name.charAt(0).toUpperCase() + answers.name.slice(1);
  const successType = answers.successType || 'any';

  let result = `${ imp }`;

  const reducer =
    `/** ${ answers.description } */
    createTypedHandler(${ answers.actionName }${ answers.async ? 'Success' : '' }, (state: I${ capName }State, action: Action<${ successType }>): I${ capName }State => {
      
      return {
        ...state,${answers.reducerKey ? `\n        ${answers.reducerKey}: action.payload` : ''}
      };
    }),`;

  if (init) {
    result += `\n
export interface I${ capName }State {
  ${answers.reducerKey ? `${answers.reducerKey}: ${ successType };` : ''}
}

export const initialState: I${ capName }State = {
  ${answers.reducerKey ? `${answers.reducerKey}: ${getTestPayload(successType)},` : ''}
};

const ${ name }Reducer = handleTypedActions(
  [
    ${ reducer }
  ],
  initialState
);

export default ${ name }Reducer;`
  } else {
    result += reducer;
  }

  return result;
}

// ---------------------------------------------------------------------------------------------------------------------

module.exports = {
  reducerTemplate
}
