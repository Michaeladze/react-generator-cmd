const storeIndexTemplate = () => {
  return `import { combineEpics } from 'redux-observable';
import { combineReducers } from 'redux';

/* [imports:end] */

export interface IStore {

  /* [types:end] */
}

/** Register reducers */
export const reducers = combineReducers({

  /* [reducers:end] */
});

export const effects$ = combineEpics<any, any, any>(

  /* [effects:end] */
);

`;
};


// ---------------------------------------------------------------------------------------------------------------------

module.exports = {
  storeIndexTemplate
}
