const { getTestPayload } = require('../../utils')

const testsTemplate = (name, answers) => {
  return `import { ${ answers.actionName }Pending, ${ answers.actionName }Success } from '../../actions/${ name }.actions';
import { ${ answers.actionName }Effect$ } from '../../effects/${ name }.effects';
import { lastValueFrom, of, throwError } from 'rxjs';
import { StateObservable } from 'redux-observable';
import { IStore } from '../../index';
import { Action } from 'redux-actions';
import { errorAction } from '../../_common/actions';
import ${ name }Reducer, { initialState } from '../../reducers/${ name }.reducer';

describe('Tests for ${ answers.actionName }Effect', () => {

  const action$ = of({ type: ${ answers.actionName }Pending.toString(), payload: ${getTestPayload(answers.pendingType)} });
  const state$ = {} as StateObservable<IStore>;

  it('should dispatch ${ answers.actionName }Success action', async () => {
    const dependencies = {
      services: {
        ${ answers.actionName }: () => of(${getTestPayload(answers.successType)})
      }
    };

    const effect$ = ${ answers.actionName }Effect$(action$, state$, dependencies);
    const action: Action<any> = await lastValueFrom(effect$);

    expect(action.type).toBe(${ answers.actionName }Success.toString());
    expect(action.payload).toBe(${getTestPayload(answers.successType)});
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

  it('should return the initial state', () => {
    const action: Action<any> = { type: 'Empty', payload: '' };
    expect(${ name }Reducer(undefined, action)).toEqual(initialState);
  });

  it('should handle ${ answers.actionName }Success action', () => {
    const payload = ${getTestPayload(answers.successType)};
    const action: Action<any> = { type: ${ answers.actionName }Success.toString(), payload };
    const nextState = ${ name }Reducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,
      collection: payload
    });
  });
  
`;
};

module.exports = {
  testsTemplate
};
