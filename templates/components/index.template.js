export default ({ ComponentName }) => {

  return {
    init: `/* istanbul ignore file */
import { ${ComponentName} } from './${ComponentName}';

export { ${ComponentName} };
`
  };
};
