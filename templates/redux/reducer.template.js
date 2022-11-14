module.exports = ({ FileName, sliceName, reducerName }) => {
  return `import { combineReducers } from 'redux';

import { ${sliceName}Slice } from './${FileName}/slice';

export const reducer = combineReducers({
  [${sliceName}Slice.name]: ${sliceName}Slice.reducer,
});

type LocalRootReduxState = ReturnType<typeof reducer>;

export type RootReduxState = {
  ${reducerName}: LocalRootReduxState;
};`;
};
