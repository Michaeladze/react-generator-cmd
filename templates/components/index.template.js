module.exports = ({ ComponentName }) => {

  return `import { ${ComponentName} } from './${ComponentName}';

export { ${ComponentName} };
`;
};
