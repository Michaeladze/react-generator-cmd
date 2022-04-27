const storeIndexTemplate = (json) => {

  const register = json.redux.registerDependents === false ? '' :
    `/** Register reducers */
export const reducers = combineReducers({

/* [reducers:end] */
});

export const effects$ = combineEpics<any, any, any>(

/* [effects:end] */
);
`

  const registerImports = json.redux.registerDependents === false ? '' :
    `import { combineEpics } from 'redux-observable';
import { combineReducers } from 'redux';\n
`

  return `${registerImports}
/* [imports:end] */

export interface IStore {

  /* [types:end] */
}

${register}
`;
};


// ---------------------------------------------------------------------------------------------------------------------

module.exports = {
  storeIndexTemplate
}
