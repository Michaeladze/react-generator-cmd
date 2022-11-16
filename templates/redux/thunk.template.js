module.exports = ({ FileName, successType, thunkName }) => {
  return `import { createAsyncThunk } from '@reduxjs/toolkit';
import { UARApi } from './services';
import { ${successType} } from './types';

export const ${thunkName} = createAsyncThunk<${successType}>(
  'uar/${thunkName}',
  async (): Promise<${successType}> => {
    return await UARApi.${thunkName}();
  },
);
`;
};
