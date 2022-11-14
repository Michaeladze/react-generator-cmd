module.exports = ({ ComponentName }) => {

  return `/* istanbul ignore file */
import { ${ComponentName} } from './${ComponentName}';

export { ${ComponentName} };
`;
};
