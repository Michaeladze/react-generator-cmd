export interface IConfig {
  root: string;
  structure: any;
  css: IConfigCss;
  redux: IConfigRedux;
  testAlias: IConfigTests;
  explicit: boolean;
  router: IConfigRouter;
  applications: string;
}

export enum IConfigCss {
  Css = 'css',
  Scss = 'scss',
  Less = 'less',
  Sass = 'sass',
  Styled = 'styled'
}

export interface IConfigRedux {
  folder: string;
  mainApplication: string;
  registerDependents: boolean;
}

export enum IConfigTests {
  Test = 'test',
  Spec = 'spec'
}

export interface IConfigRouter {
  path: string;
  pageAlias: string;
}
