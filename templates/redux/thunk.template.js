module.exports = ({ successType, thunkName, serviceNamespace }) => {

  const serviceString = `export const ${thunkName} = createAsyncThunk<${successType}>(
  'uar/${thunkName}',
  async (): Promise<${successType}> => {
    return await ${serviceNamespace}.${thunkName}();
  },
);`;

  return {
    init: `import { createAsyncThunk } from '@reduxjs/toolkit';
import { ${serviceNamespace} } from './services';
import { ${successType} } from './types';

${serviceString}
`,
    updates: [
      {
        direction: 'up',
        searchFor: ['includes', ');'],
        changeWith: `);\n\n${serviceString}`
      },
      {
        fromLine: ['includes', './types'],
        direction: 'up',
        searchFor: ['includes', '}'],
        changeWith: `, ${successType} }`,
        when: ['not includes', successType],
      }
    ]
  };
};
