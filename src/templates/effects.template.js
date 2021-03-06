const { typesImport } = require('../utils');

const effectTemplate = (name, path, answers, imports = false) => {
  const pendingType = answers.pendingType || 'void';
  const successType = answers.successType || 'any';

  const imp = imports ? `import { ActionsObservable, ofType } from 'redux-observable';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Action } from 'redux-actions';
import { showErrorMessage } from '../_commonActions/error.actions';
${ typesImport(name, answers) }
import { ${ answers.actionName } } from '../services/${ name }.services';
import { ${ answers.actionName }Pending, ${ answers.actionName }Success } from '../actions/${ name }.actions';` : '';

  const payload = pendingType !== 'void' ? 'payload' : '';

  return `${ imp } \n
/** ${ answers.description } */
export const ${ answers.actionName }Effect$ = (actions$: ActionsObservable<Action<${ pendingType }>>) =>
  actions$.pipe(
    ofType(${ answers.actionName }Pending.toString()),
    switchMap((${ payload ? `{ ${ payload } }` : '' }) =>
      ${ answers.actionName }(${ payload }).pipe(
        map((result: ${ successType }) => ${ answers.actionName }Success(result)),
        catchError(showErrorMessage)
      )
    )
  );
`
}

// ---------------------------------------------------------------------------------------------------------------------

module.exports = {
  effectTemplate
}
