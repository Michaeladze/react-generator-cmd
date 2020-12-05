const { typesImport } = require('../utils');

const serviceTemplate = (name, path, answers, imports = false) => {
  const successType = answers.successType || 'any';
  const pendingType = answers.pendingType || 'void';

  const imp = imports ? `import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import Axios from 'axios-observable';
import { AxiosResponse } from 'axios';
${ typesImport(name, answers) }` : '';

  const payload = pendingType !== 'void' ? `payload: ${pendingType}` : '';

  return `${ imp } \n
/** ${ answers.description } */
export const ${ answers.actionName } = (${payload}): Observable<${ successType }> => {
  return Axios.${answers.method.toLowerCase()}(\`/${answers.actionName}\`).pipe(map(({ data }: AxiosResponse<${successType}>) => data));
};
`
}

// ---------------------------------------------------------------------------------------------------------------------

module.exports = {
  serviceTemplate
}
