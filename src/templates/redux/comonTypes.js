const commonTypesTemplate = () => {
  return `import { Observable } from 'rxjs';

type F = (...args: any[]) => Observable<any>;

export type ServiceClient = Record<string, F>;

export interface EffectOptions {
  services: ServiceClient;
}

`
}

module.exports = {
  commonTypesTemplate
}
