const { getTestPayload } = require('../../utils');
const { typesImport } = require('../../utils');

const testsTemplate = (name, answers) => {

  const asyncImports = answers.async ?
    `import { ${ answers.actionName }Pending, ${ answers.actionName }Success } from '../../actions/${ name }.actions';
import { ${ answers.actionName }Effect$ } from '../../effects/${ name }.effects';
import { lastValueFrom, of, throwError } from 'rxjs';
import { errorAction } from '../../_common/actions';
import * as service from '../../services/${ answers.name }.services';` :
    `import { ${ answers.actionName }} from '../../actions/${ name }.actions';`;

  const asyncTests = answers.async ?
    `
  const action$ = of({ type: ${ answers.actionName }Pending.toString(), payload: ${ getTestPayload(answers.pendingType) } });

  it('should dispatch ${ answers.actionName }Success action', async () => {
    const payload: ${ answers.successType } = ${ getTestPayload(answers.successType) };
    jest.spyOn(service, '${answers.actionName}').mockReturnValue(of(payload));

    const effect$ = ${ answers.actionName }Effect$(action$);
    const action: Action<any> = await lastValueFrom(effect$);

    expect(action.type).toBe(${ answers.actionName }Success.toString());
    expect(action.payload).toBe(payload);
  });

  it('should dispatch error action', async () => {
    jest.spyOn(service, '${answers.actionName}').mockReturnValue(throwError(() => new Error('test')));
    const effect$ = ${ answers.actionName }Effect$(action$);
    const action: Action<any> = await lastValueFrom(effect$);

    expect(action.type).toBe(errorAction.toString());
  });
` : '';


  return `${ asyncImports }
import { Action } from 'redux-actions';
import ${ name }Reducer, { initialState } from '../../reducers/${ name }.reducer';
${ typesImport(name, answers, true, true) }

describe('Tests for ${ answers.actionName }', () => {
  ${ asyncTests }
  it('should return the initial state', () => {
    const action: Action<any> = { type: 'Empty', payload: '' };
    expect(${ name }Reducer(undefined, action)).toEqual(initialState);
  });

  it('should handle ${ answers.actionName }Success action', () => {
    const payload: ${ answers.successType } = ${ getTestPayload(answers.successType) };
    const action: Action<any> = { type: ${ answers.actionName }${ answers.async ? 'Success' : '' }.toString(), payload };
    const nextState = ${ name }Reducer(initialState, action);
    expect(nextState).toEqual({
      ...initialState,${ answers.reducerKey ? `\n      ${ answers.reducerKey }: payload` : '' }
    });
  });
  
}); 

`;
};

module.exports = {
  testsTemplate
};
