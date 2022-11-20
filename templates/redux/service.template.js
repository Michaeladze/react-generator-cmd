export default ({ serviceNamespace, thunkName, pendingType, successType }) => {

  const serviceString = `async ${thunkName}(payload: ${pendingType}): Promise<${successType}> {
    return await fetch('${thunkName}');
  },`;

  return {
    init: `import { ${pendingType}, ${successType} } from './types';

export const ${serviceNamespace} = {
  ${serviceString}
}
`,
    updates: [
      {
        fromLine: ['includes', './types'],
        direction: 'up',
        searchFor: ['includes', '}'],
        changeWith: `, ${pendingType} }`,
        when: ['not includes', pendingType],
      },
      {
        fromLine: ['includes', './types'],
        direction: 'up',
        searchFor: ['includes', '}'],
        changeWith: `, ${successType} }`,
        when: ['not includes', successType],
      },
      {
        direction: 'up',
        searchFor: ['includes', '}'],
        changeWith: `${serviceString}\n\n}`
      }
    ]
  };
};
