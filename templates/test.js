import A from 'react-generator-cmd';

export default ({ successType }) => {

  console.log(A);

  const selectorString = `export const use${A.capitalize(successType)}Selector = () => {
  return useSelector<RootReduxState, ${successType}>((store: RootReduxState) => store.${successType}.${successType}.${successType});
};`;

  const importSuccessType = `import { ${successType} } from './types';`;

  return {
    init: `import { useSelector } from 'react-redux';
import { RootReduxState } from '../reducer';

${importSuccessType}

${selectorString}
`,
    updates: [
      {
        fromLine: ['includes', './types'],
        direction: 'up',
        searchFor: ['includes', '}'],
        changeWith: `, ${successType} }`,
        when: ['not includes', successType],
        fallback: {
          fromLine: ['includes', '\'../reducer\';'],
          searchFor: ['includes', ';'],
          changeWith: `;\n\n${importSuccessType}`
        }
      },
      {
        direction: 'up',
        searchFor: ['includes', '};'],
        changeWith: `};\n\n${selectorString}`
      }
    ]
  };
};
