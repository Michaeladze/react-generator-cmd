const storeIndexTemplate = () => {
  return `import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

/*[imports:end] */

export interface IStore {

  /*[types:end] */
}

const observableMiddleware = createEpicMiddleware();

/** Register reducers */
const reducers = combineReducers({

  /*[reducers:end] */
})

/** Create store */
export const store = createStore(reducers, composeWithDevTools(applyMiddleware(observableMiddleware)));

/** Register effects */
// @ts-ignore
observableMiddleware.run(combineEpics(
  
  /*[effects:end] */
  )
);
`;
};


// ---------------------------------------------------------------------------------------------------------------------

module.exports = {
  storeIndexTemplate
}
