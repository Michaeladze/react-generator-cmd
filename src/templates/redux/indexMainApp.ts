export const storeIndexMainTemplate = () => {
  return `import { combineEpics, createEpicMiddleware, Epic, StateObservable } from 'redux-observable';
import { Action, applyMiddleware, combineReducers, createStore, Reducer, ReducersMapObject } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import {
  BehaviorSubject, mergeMap, Observable
} from 'rxjs';

/* [imports:end] */

export interface IStore {

  /* [types:end] */
}

const observableMiddleware = createEpicMiddleware();

/** Register reducers */
const reducers = {

  /* [reducers:end] */
};

/** Create store */
export const store = createStore(createReducer(), composeWithDevTools(applyMiddleware(observableMiddleware)));

export const effects$ = new BehaviorSubject(combineEpics<any, any, any>(

  /* [effects:end] */
));

const rootEffect = (action$: Observable<Action<void>>, state$: StateObservable<IStore>) => effects$.pipe(
  mergeMap((epic: Epic<any, any>) => epic(action$, state$, {}))
);

/** Register effects */
observableMiddleware.run(combineEpics<any, any, any>(rootEffect));

// ---------------------------------------------------------------------------------------------------------------------
/** Functions for code splitting */

const asyncReducers: ReducersMapObject<any, Action<any>> = {};
const asyncEffects: Record<string, Epic<any, any, any>> = {};

export function createReducer(asyncReducers?: ReducersMapObject<any, Action<any>>) {
  return combineReducers({
    ...reducers,
    ...asyncReducers,
  });
}

export function injectReducer(key: string, asyncReducer: Reducer) {
  if (asyncReducers[key] === undefined) {
    asyncReducers[key] = asyncReducer;
    store.replaceReducer(createReducer(asyncReducers));
  }
}

export function injectEffect(key: string, asyncEffect$: Epic<any, any, any>) {
  if (asyncEffects[key] === undefined) {
    asyncEffects[key] = asyncEffect$;
    effects$.next(asyncEffect$);
  }
}

`;
};
