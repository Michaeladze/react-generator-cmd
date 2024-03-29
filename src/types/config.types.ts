import { IAnswersBase } from './types';

export interface IConfig {
  variables: IConfigVariables;
  domains: IConfigDomain[];
}

export interface IConfigDomain {
  name: string;
  structure: any;
  templates: IConfigComponentTemplates[];
  questions: IConfigComponentQuestion[];
}

export interface IConfigComponentTemplates {
  name: string | ((answers: IAnswersBase) => string);
  template: string | ((answers: IAnswersBase) => string);
  when?: (answers: IAnswersBase) => boolean;
}

export interface IConfigComponentQuestion {
  name: string;
  message: string;
  type: string;
  validate?: (input: any) => boolean;
  when?: boolean | ((answers: IAnswersBase) => boolean);
}

export interface IConfigVariablesRequired {
  root: string;
}

export type IConfigVariables = IConfigVariablesRequired & Record<string, string>;

export type ITemplateInvoker = (answers: IAnswersBase) => ITemplate;

export interface ITemplate {
  init: string;
  updates: ITemplateUpdate[]
}

export interface ITemplateUpdate {
  fromLine?: [TemplateUpdateOperator, string],
  toLine?: [TemplateUpdateOperator, string],
  direction?: TemplateUpdateDirection;
  searchFor: [TemplateUpdateOperator, string],
  changeWith: string;
  when?: [TemplateUpdateOperator, string] | boolean;
  fallback?: ITemplateUpdate;
}

export enum TemplateUpdateOperator {
  NotIncludes = 'not includes',
  Includes = 'includes',
  Equal = '===',
  NotEqual = '!=='
}

export enum TemplateUpdateDirection {
  Up = 'up',
  Down = 'down'
}

export type IIndexes = [number, number];
