export type IAnswersBase = Record<string, any>;

export enum Question {
  Create = 'create',
  ApplicationName = 'applicationName',
  Application = 'application',
  FileName = 'fileName',
  Route = 'route',
  Tests = 'tests',
  ComponentOptions = 'componentOptions',
}

export enum Answer {
  Component = 'Component',
  ReduxState = 'Redux State',
  CreateNew = '[Create New]'
}

export interface IQuestion {
  name: string;
  answer: string;
}
