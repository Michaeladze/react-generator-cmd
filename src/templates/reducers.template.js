const { typesImport } = require('../utils');

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
      ...state,
      };
    }),`;

  if (init) {
    result += `\n
export interface I${ capName }State {
  collection: ${ successType };
}

const initialState: I${ capName }State = {
  collection: []
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
