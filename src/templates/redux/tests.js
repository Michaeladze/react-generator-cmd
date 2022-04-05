const testsTemplate = (name, answers) => {
  return `import { ${ answers.actionName }Pending, ${ answers.actionName }Success } from '../../actions/${ name }.actions';
import { ${ answers.actionName }Effect$ } from '../../effects/${ name }.effects';
import { lastValueFrom, of, throwError } from 'rxjs';
import { StateObservable } from 'redux-observable';
import { IStore } from '../../index';
import { Action } from 'redux-actions';
import { errorAction } from '../../_common/actions';

describe('Tests for ${ answers.actionName }Effect', () => {

  const action$ = of({ type: ${ answers.actionName }Pending.toString(), payload: 1 });
  const state$ = {} as StateObservable<IStore>;

  it('should dispatch ${ answers.actionName }Success action', async () => {
    const dependencies = {
      services: {
        ${ answers.actionName }: () => of('test')
      }
    };

    const effect$ = ${ answers.actionName }Effect$(action$, state$, dependencies);
    const action: Action<any> = await lastValueFrom(effect$);

    expect(action.type).toBe(${ answers.actionName }Success.toString());
    expect(action.payload).toBe('test');
  });

  it('should dispatch error action', async () => {

    const dependencies = {
      services: {
        ${ answers.actionName }: () => {
          return throwError(() => new Error('Test Error'));
        }
      }
    };

    const effect$ = ${ answers.actionName }Effect$(action$, state$, dependencies);
    const action: Action<any> = await lastValueFrom(effect$);

    expect(action.type).toBe(errorAction.toString());
  });
});

`;
};

module.exports = {
  testsTemplate
};
