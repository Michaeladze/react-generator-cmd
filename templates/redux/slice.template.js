module.exports = ({ FileName, sliceName, fieldName, successType, thunkName }) => {

  return `import { createSlice } from '@reduxjs/toolkit';
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
`;
};
