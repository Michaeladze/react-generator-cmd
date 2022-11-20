export default ({ FileName, sliceName, reducerName }) => {

  const importSliceString = `import { ${sliceName}Slice } from './${FileName}/slice';`;
  const sliceString = `[${sliceName}Slice.name]: ${sliceName}Slice.reducer,`;
  const reducerString = `${reducerName}: LocalRootReduxState;`;

  return {
    init: `import { combineReducers } from 'redux';

${importSliceString}

export const reducer = combineReducers({
  ${sliceString}
});

type LocalRootReduxState = ReturnType<typeof reducer>;

export type RootReduxState = {
  ${reducerString}
};
`,
    updates: [
      {
        searchFor: ['includes', 'slice\';'],
        changeWith: `slice';\n${importSliceString}`,
        when: ['not includes', sliceString],
      },
      {
        fromLine: ['includes', 'combineReducers'],
        searchFor: ['includes', '});'],
        changeWith: `${sliceString}\n});`,
        when: ['not includes', sliceString],

      },
      {
        fromLine: ['includes', 'export type RootReduxState'],
        searchFor: ['includes', '};'],
        changeWith: `${reducerString}\n};`,
        when: ['not includes', reducerString],
      }
    ]
  };
};
