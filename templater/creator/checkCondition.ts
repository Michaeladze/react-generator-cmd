import { TemplateUpdateOperator } from '../types/config.types';

export const checkCondition = (line: string, when?: [TemplateUpdateOperator, string] | undefined): boolean => {
  if (when === undefined) {
    return true;
  }

  const map: Record<TemplateUpdateOperator, boolean> = {
    [TemplateUpdateOperator.NotIncludes]: !line.includes(when[1]),
    [TemplateUpdateOperator.Includes]: line.includes(when[1]),
    [TemplateUpdateOperator.NotEqual]: line !== when[1],
    [TemplateUpdateOperator.Equal]: line === when[1],
  };

  return map[when[0]];
};
