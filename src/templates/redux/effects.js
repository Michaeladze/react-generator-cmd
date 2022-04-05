const { typesImport } = require('../../utils');

const effectTemplate = (name, path, answers, imports = false) => {
  const pendingType = answers.pendingType || 'void';
  const successType = answers.successType || 'any';

  const imp = imports ? `import { ofType, StateObservable } from 'redux-observable';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Action } from 'redux-actions';
import { IStore } from '../index';
import { showErrorMessage } from '../_common/actions';
import { EffectOptions } from '../_common/types';
${ typesImport(name, answers) }
import { ${ answers.actionName }Pending, ${ answers.actionName }Success } from '../actions/${ name }.actions';` : '';

  const payload = pendingType !== 'void' ? 'payload' : '';

  return `${ imp } \n
/** ${ answers.description } */
export const ${ answers.actionName }Effect$ = (actions$: Observable<Action<${ pendingType }>>, _state$: StateObservable<IStore>, { services }: EffectOptions) =>
  actions$.pipe(
    ofType(${ answers.actionName }Pending.toString()),
    switchMap((${ payload ? `{ ${ payload } }` : '' }) =>
      services.${ answers.actionName }(${ payload }).pipe(
        map((result: ${ successType }) => ${ answers.actionName }Success(result)),
        catchError(showErrorMessage)
      )
    )
  );`
}

// ---------------------------------------------------------------------------------------------------------------------

module.exports = {
  effectTemplate
}
