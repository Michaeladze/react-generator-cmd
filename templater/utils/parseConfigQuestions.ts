import { IConfig } from '../types/config.types';

export const parseConfigQuestions = (config: IConfig): IConfig => {
  return {
    ...config
  };
};
