export default ({ sliceName, fieldName, successType, thunkName }) => {

  const asyncBuilderString = `builder.addCase(${thunkName}.fulfilled, (state: I${sliceName}Slice, { payload }) => {
  state.${fieldName} = payload;
});`;

  return {
    init: `import { createSlice } from '@reduxjs/toolkit';
import { ${successType} } from './types';

import { ${thunkName} } from './thunks';

export interface I${sliceName}Slice {
  ${fieldName}: ${successType};
}

const initialState: I${sliceName}Slice = {
  ${fieldName}: {},
};

export const ${sliceName}Slice = createSlice({
  name: '${sliceName}',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    ${asyncBuilderString}
  },
});
`,
    updates: [
      {
        fromLine: ['includes', './types'],
        direction: 'up',
        searchFor: ['includes', '}'],
        changeWith: `, ${successType} }`,
        when: ['not includes', successType],
      },
      {
        fromLine: ['includes', './thunks'],
        direction: 'up',
        searchFor: ['includes', '}'],
        changeWith: `, ${thunkName} }`,
        when: ['not includes', thunkName],
      },
      {
        fromLine: ['includes', `export interface I${sliceName}Slice`],
        searchFor: ['includes', '}'],
        changeWith: `${fieldName}: ${successType};\n}`
      },
      {
        fromLine: ['includes', 'const initialState'],
        searchFor: ['includes', '};'],
        changeWith: `${fieldName}: {},\n}`
      },
      {
        fromLine: ['includes', 'extraReducers'],
        searchFor: ['includes', '});'],
        changeWith: `});\n${asyncBuilderString}`
      }
    ]
  };
};
