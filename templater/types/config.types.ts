export interface IConfig {
  variables: IConfigVariables;
  explicit?: boolean;
  domains: IConfigDomain[];
}

export interface IConfigDomain {
  name: string;
  structure: any;
  templates: IConfigComponentTemplates[];
  questions: IConfigComponentQuestion[];
}

export interface IConfigComponentTemplates {
  name: string;
  template: string;
  condition?: string;
}

export interface IConfigComponentQuestion {
  name: string;
  message: string;
  type: string;
  required?: boolean;
  validate?: (input: any) => boolean;
}

export interface IConfigVariables {
  root: string;
}
