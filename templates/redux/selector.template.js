module.exports = ({ FileName, fieldName, reducerName, sliceName, successType }) => {
  return `import { useSelector } from 'react-redux';
import { ${successType} } from './types';

import { RootReduxState } from '../reducer';

export const use${fieldName}Selector = () => {
  return useSelector<RootReduxState, ${successType}>((store: RootReduxState) =>
    store.${reducerName}.${sliceName}Slice.${fieldName});
};
`;
};
