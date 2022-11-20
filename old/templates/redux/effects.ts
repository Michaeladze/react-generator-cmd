import { IAnswersBase } from '../../types/types';
import { typesImport } from '../../utils';

export const effectTemplate = (name: string, path: string, answers: IAnswersBase, imports = false) => {
  const pendingType = answers.pendingType || 'void';
  const successType = answers.successType || 'any';

  const imp = imports ? `import { ofType } from 'redux-observable';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Action } from 'redux-actions';
import { showErrorMessage } from '../_common/actions';
${typesImport(name, answers)}
import { ${answers.actionName}Pending, ${answers.actionName}Success } from '../actions/${name}.actions';
import { ${answers.actionName} } from '../services/${name}.services';` : '';

  const payload = pendingType !== 'void' ? 'payload' : '';

  return `${imp} \n
/** ${answers.description} */
export const ${answers.actionName}Effect$ = (actions$: Observable<Action<${pendingType}>>) =>
  actions$.pipe(
    ofType(${answers.actionName}Pending.toString()),
    switchMap((${payload ? `{ ${payload} }` : ''}) =>
      ${answers.actionName}(${payload}).pipe(
        map((result: ${successType}) => ${answers.actionName}Success(result)),
        catchError(showErrorMessage)
      )
    )
  );`;
};
