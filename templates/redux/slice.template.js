module.exports = ({ sliceName, fieldName, successType, thunkName }) => {
  return {
    init: `import { createSlice } from '@reduxjs/toolkit';
import { ${successType} } from './types';

import { ${thunkName} } from './thunk';

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
    builder.addCase(${thunkName}.fulfilled, (state: I${sliceName}Slice, { payload }) => {
      state.${fieldName} = payload;
    });
  },
});
`,
    updates: [
      {
        startFromLineThatContains: 'from \'./types\';',
        searchFor: '}',
        changeWith: `, ${successType} }`,
        whenLine: ['not includes', successType]
      },
      {
        startFromLineThatContains: 'from \'./thunk\';',
        searchFor: '}',
        changeWith: `, ${thunkName} }`
      },
      {
        startFromLineThatContains: `export interface I${sliceName}Slice`,
        searchFor: '}',
        changeWith: `${fieldName}: ${successType};\n}`
      },
      {
        startFromLineThatContains: `const initialState: I${sliceName}Slice`,
        searchFor: '};',
        changeWith: `${fieldName}: {},\n}`
      },
      {
        startFromLineThatContains: 'extraReducers',
        searchFor: '},',
        changeWith: `builder.addCase(${thunkName}.fulfilled, (state: I${sliceName}Slice, { payload }) => {
                      state.${fieldName} = payload;
                    });`
      }
    ]
  };
};
