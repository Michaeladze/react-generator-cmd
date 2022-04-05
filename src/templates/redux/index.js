const storeIndexTemplate = () => {
  return `import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { EffectOptions } from './_common/types';

/*[imports:end] */

export interface IStore {

  /*[types:end] */
}

const dependencies: EffectOptions = {
  services: {
    
    /*[services:end] */
  }
};

const observableMiddleware = createEpicMiddleware({ dependencies });

/** Register reducers */
const reducers = combineReducers({

  /*[reducers:end] */
})

/** Create store */
export const store = createStore(reducers, composeWithDevTools(applyMiddleware(observableMiddleware)));

/** Register effects */
observableMiddleware.run(combineEpics<any, any, any, any>(
  
  /*[effects:end] */
  )
);
`;
};


// ---------------------------------------------------------------------------------------------------------------------

module.exports = {
  storeIndexTemplate
}
