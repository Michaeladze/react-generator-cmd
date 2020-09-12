const { replaceParentheses } = require('./mk');

const basicTypes = {
  number: true,
  string: true,
  boolean: true,
  any: true,
  void: true,
  null: true,
  undefined: true
}

const tsxTemplate = (name, answers) => {

  let storeImport = '';
  let historyImport = '';
  let locationImport = '';
  let formImport = '';
  let formTemplate = '';
  let childrenImport = false;

  answers.componentOptions.forEach((o) => {
    if (o === 'Redux') {
      storeImport = `import { useDispatch, useSelector } from 'react-redux';\nimport { IStore } from '../../../_store';\n`;
    }

    if (o === 'useLocation') {
      locationImport = `import { useLocation } from 'root-front';\n`;
    }

    if (o === 'useHistory') {
      historyImport = `import { useHistory } from 'react-router-dom';\n`;
    }

    if (o === 'Children') {
      childrenImport = true;
    }

    if (o === 'useReactiveForm') {
      formImport = `import { useReactiveForm } from 'use-reactive-form';\nimport { object } from 'yup';\n`;
      formTemplate = `const config = {
    fields: {},
    schema: object().shape({
    })
  }
    
  const { ref, values, errors, validate } = useReactiveForm(config);
    
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      console.log(values);
    } else {
      console.log(errors);
    }
  };
    
  // -------------------------------------------------------------------------------------------------------------------
  `
    }
  })


  return `import React${childrenImport ? ', { ReactNode } ' : ''}from 'react';
import './${ name }.scss';
${storeImport}${locationImport}${historyImport}${formImport}

interface IProps {
    ${childrenImport ? 'children: ReactNode | ReactNode[];' : ''}
}

const ${ name }: React.FC<IProps> = ({${childrenImport ? 'children' : ''}}: IProps) => {
  ${storeImport ? 'const dispatcher = useDispatch();\n' : ''}${locationImport ? '  const location = useLocation();\n' : ''}${historyImport ? '  const history = useHistory();\n' : ''}
  ${storeImport ? 'const store = useSelector((store: IStore) => store);' : ''}

  // -------------------------------------------------------------------------------------------------------------------
    
  ${formTemplate}

  return (
    <div className=''>
      ${formImport ? `<form className='' ref={ref} onSubmit={onSubmit}>

      </form>` : ''}
    </div>
  );
};

export default ${ name };
  `
};

// ---------------------------------------------------------------------------------------------------------------------

const indexTemplate = (name) => {
  return `import ${ name } from './${ name }';

export default ${ name };
`
}

// ---------------------------------------------------------------------------------------------------------------------

const typesImport = (name, answers, needPending = true) => {
  let result = '';
  let hasPending = false;

  const pt = answers.pendingType && replaceParentheses(answers.pendingType);
  const st = answers.successType && replaceParentheses(answers.successType);

  const checkPending = !basicTypes[pt];
  const checkSuccess = !basicTypes[st];

  if (checkPending || checkSuccess) {
    result += 'import { ';

    if (checkPending && needPending) {
      result += pt;
      hasPending = true;
    }

    if (checkSuccess) {
      if (hasPending) {
        result += ', ';
      }
      result += `${ st }`;
    }

    result += ` } from '../types/${ name }.types';`;
  }

  if (!needPending && !checkSuccess) {
    result = '';
  }

  return result;
}

// ---------------------------------------------------------------------------------------------------------------------

const storeIndexTemplate = () => {
  return `import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

/*[imports:end] */

export interface IStore {

  /*[types:end] */
}

const observableMiddleware = createEpicMiddleware();

/** Регистрируем редьюсеры */
const reducers = combineReducers({

  /*[reducers:end] */
})

/** Создаем store */
export const store = createStore(reducers, composeWithDevTools(applyMiddleware(observableMiddleware)));

/** Регистрируем эффекты */
// @ts-ignore
observableMiddleware.run(combineEpics(
  
  /*[effects:end] */
  )
);
`;
};

// ---------------------------------------------------------------------------------------------------------------------

const actionTemplate = (name, answers, imports = false) => {
  const imp = imports ? `import { createTypedAction } from 'redux-actions-ts';
${ typesImport(name, answers) }` : '';

  const actions = answers.async ? `export const ${ answers.actionName }Pending = createTypedAction<${ answers.pendingType || 'void' }>('[Pending] ${ answers.description }');
export const ${ answers.actionName }Success = createTypedAction<${ answers.successType || 'void' }>('[Success] ${ answers.description }');` :
    `export const ${ answers.actionName } = createTypedAction<${ answers.pendingType || 'void' }>('${ answers.description }');`

  return `${ imp }\n\n${ actions }`;
}

// ---------------------------------------------------------------------------------------------------------------------

const effectTemplate = (name, path, answers, imports = false) => {
  const pendingType = answers.pendingType || 'void';
  const successType = answers.successType || 'any';

  const imp = imports ? `import { ActionsObservable, ofType } from 'redux-observable';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Action } from 'redux-actions';
import { showErrorMessage } from '../_commonActions/error';
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

const serviceTemplate = (name, path, answers, imports = false) => {
  const successType = answers.successType || 'any';
  const pendingType = answers.pendingType || 'void';

  const imp = imports ? `import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
// import Axios from 'axios-observable';
// import { AxiosResponse } from 'axios';
${ typesImport(name, answers) }` : '';

  const payload = pendingType !== 'void' ? `payload: ${pendingType}` : '';

  return `${ imp } \n
/** ${ answers.description } */
export const ${ answers.actionName } = (${payload}): Observable<${ successType }> => {
  return of([]).pipe(map((data: ${ successType }) => data));
  // return Axios.get(\`/${answers.actionName}\`).pipe(map(({ data }: AxiosResponse<${successType}>) => data));
};
`
}

// ---------------------------------------------------------------------------------------------------------------------

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
    createTypedHandler(${ answers.actionName }${ answers.async ? 'Success' : '' }, (state: I${ capName }State, action: Action<${ successType }>) => {
      
      return state;
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
  indexTemplate, tsxTemplate, actionTemplate, effectTemplate, serviceTemplate, reducerTemplate, storeIndexTemplate, basicTypes,
  typesImport
}