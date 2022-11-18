module.exports = ({ successType }) => {

  const selectorString = `export const use${successType}Selector = () => {
  return useSelector<RootReduxState, ${successType}>((store: RootReduxState) => store.${successType}.${successType}.${successType});
};`;

  return {
    init: `import { ${successType} } from './types';

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
