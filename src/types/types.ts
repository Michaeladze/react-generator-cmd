export enum CreateEntity {
  Component = 'Component',
  ReduxObservableState = 'Redux Observable State',
  ReduxToolkitSlice = 'Redux Toolkit Slice'
}

export type IAnswersBase = Record<string, any>;

export enum Question {
  Create = 'create',
  Name = 'name',
  ApplicationName = 'applicationName',
  Application = 'application'
}

export enum Answer {
  Component = 'Component',
  ReduxState = 'Redux State',
  CreateNew = '[Create New]'
}
