import { IConfig } from '../../types/config.types';

export const storeIndexTemplate = (json: IConfig) => {

  const register = !json.redux.registerDependents ? '' :
    `/** Register reducers */
export const reducers = combineReducers({

/* [reducers:end] */
});

export const effects$ = combineEpics<any, any, any>(

/* [effects:end] */
);
`;

  const registerImports = !json.redux.registerDependents ? '' :
    `import { combineEpics } from 'redux-observable';
import { combineReducers } from 'redux';\n
`;

  return `${registerImports}
/* [imports:end] */

export interface IStore {

  /* [types:end] */
}

${register}
`;
};
