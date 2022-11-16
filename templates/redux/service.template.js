module.exports = ({ FileName, thunkName, pendingType, successType }) => {
  return `import { ${pendingType}, ${successType} } from './types';

export const UARApi = {

  async ${thunkName}(payload: ${pendingType}): Promise<${successType}> {
    return await fetch('${thunkName}');
  }
}
`;
};
