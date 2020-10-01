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


  return `import React${childrenImport ? ', { ReactNode } ' : ''} from 'react';
import './${ name }.scss';
${storeImport}${locationImport}${historyImport}${formImport}

interface IProps {
    ${childrenImport ? 'children: ReactNode | ReactNode[];' : ''}
}

const ${ name }: React.FC<IProps> = ({${childrenImport ? 'children' : ''}}: IProps) => {
  ${storeImport ? 'const dispatch = useDispatch();\n' : ''}${locationImport ? '  const location = useLocation();\n' : ''}${historyImport ? '  const history = useHistory();\n' : ''}
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

  const pt = answers.pendingType ? replaceParentheses(answers.pendingType) : '';
  const st = answers.successType ? replaceParentheses(answers.successType) : '';

  const checkPending = !basicTypes[pt] && pt !== '';
  const checkSuccess = !basicTypes[st] && st !== '';

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

const commonActionsTemplate = () => {
  return `import { createTypedAction } from 'redux-actions-ts';
import { of } from 'rxjs';

export const errorAction = createTypedAction<void>('[Error] ===!!!!!!!!!===');

export const showErrorMessage = (e: Error) => {
  console.log(e.message);
  return of(errorAction());
};
`
}

// ---------------------------------------------------------------------------------------------------------------------

const typesTemplate = (name, answers, fileData) => {
  const pt = answers.pendingType ? replaceParentheses(answers.pendingType) : '';
  const st = answers.successType ? replaceParentheses(answers.successType) : '';

  const checkPending = !basicTypes[pt] && pt !== '';
  const checkSuccess = !basicTypes[st] && st !== '';

  let pendingInterface = '';
  let successInterface = '';

  if (checkPending) {
    pendingInterface = `export interface ${pt} {
}\n\n`;
  }

  if (checkSuccess) {
    successInterface = `export interface ${st} {
}\n\n`;
  }

  if (fileData) {
    fileData.forEach((l) => {
      if (l.includes(pt)) {
        pendingInterface = '';
      }
      if (l.includes(st)) {
        successInterface = '';
      }
    })
  }

  return `${pendingInterface}${successInterface}`;
}

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

const serviceTemplate = (name, path, answers, imports = false) => {
  const successType = answers.successType || 'any';
  const pendingType = answers.pendingType || 'void';

  const imp = imports ? `import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import Axios from 'axios-observable';
import { AxiosResponse } from 'axios';
${ typesImport(name, answers) }` : '';

  const payload = pendingType !== 'void' ? `payload: ${pendingType}` : '';

  return `${ imp } \n
/** ${ answers.description } */
export const ${ answers.actionName } = (${payload}): Observable<${ successType }> => {
  // return of([]).pipe(map((data: ${ successType }) => data));
  return Axios.get(\`/${answers.actionName}\`).pipe(map(({ data }: AxiosResponse<${successType}>) => data));
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

const routerConfigTemplate = () => {
  return `import React, { ComponentType, lazy, LazyExoticComponent, ReactNode } from 'react';

/** Везде, где подключается <Router routes={routes}/>, кроме App.tsx, routes: IRoute[] берется из пропсов IProps. */

export interface IRoute {
  /** Адрес */
  path: string;
  /** Точность совпадения */
  exact: boolean;
  /** Защищенный роут */
  private?: boolean;
  /** Компонент */
  component?: LazyExoticComponent<ComponentType<any>>;
  /** Дочерние роуты */
  routes?: IRoute[];
  /** Редирект*/
  redirect?: string;
  /** Прелоудер ф*/
  fallback: NonNullable<ReactNode> | null;
}

export const routes = [];
`
}

const routerTemplate = () => {
  return `import React from 'react';
import { Switch } from 'react-router-dom';
import RouteWithSubRoutes from './RouteWithSubRoutes';
import { IRoute } from './config';

interface IProps {
  routes: IRoute[];
}

const Router: React.FC<IProps> = ({ routes }: IProps) => {
  return <Switch>{routes && routes.map((route: IRoute) => <RouteWithSubRoutes key={route.path} {...route} />)}</Switch>;
};

export default Router;
`
}

const routerWithSubRoutesTemplate = () => {
  return `import React, { Suspense } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IRoute } from './config';

const RouteWithSubRoutes = (route: IRoute) => {
  const authenticated: boolean = true;

  const renderRoute = (route: IRoute, props: any) => {
    if (route.redirect) return <Redirect to={route.redirect} />;

    if ((route.private && authenticated) || !route.private) {
      return route.component && <route.component {...props} routes={route.routes} />;
    }

    return <div>Redirect Here When Not Authenticated</div>;
  };

  return (
    <Suspense fallback={route.fallback}>
      <Route path={route.path} render={(props: any) => renderRoute(route, props)} />
    </Suspense>
  );
};

export default RouteWithSubRoutes;
`
}

// ---------------------------------------------------------------------------------------------------------------------

module.exports = {
  indexTemplate, tsxTemplate, actionTemplate, effectTemplate, serviceTemplate, reducerTemplate, storeIndexTemplate, basicTypes,
  typesImport, commonActionsTemplate, typesTemplate, routerConfigTemplate, routerTemplate, routerWithSubRoutesTemplate
}
