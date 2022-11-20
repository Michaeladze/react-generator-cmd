export default ({ fieldName, reducerName, sliceName, successType }) => {

  const selectorString = `export const use${fieldName}Selector = () => {
  return useSelector<RootReduxState, ${successType}>((store: RootReduxState) =>
    store.${reducerName}.${sliceName}.${fieldName});
};`;

  return {
    init: `import { useSelector } from 'react-redux';
import { ${successType} } from './types';

import { RootReduxState } from '../reducer';

${selectorString}
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
        direction: 'up',
        searchFor: ['includes', '};'],
        changeWith: `};\n\n${selectorString}`
      }
    ]
  };
};
