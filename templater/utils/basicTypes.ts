export const baseTypes: Record<string, boolean> = {
  number: true,
  string: true,
  boolean: true,
  any: true,
  void: true,
  null: true,
  undefined: true
};

export const baseTypesArray: string[] = [
  'number',
  'string',
  'boolean',
  'any',
  'void',
  'null',
  'undefined'
];

export const basicTypesTestPayload: Record<string, any> = {
  number: 1,
  string: '\'Test\'',
  boolean: true,
  any: true,
  void: undefined,
  null: null,
  undefined
};

export const getTestPayload = (type: string): string | undefined => {
  if (type.includes('[]')) {
    return '[]';
  }

  if (type === '') {
    return undefined;
  }

  return `${basicTypesTestPayload[type] || `{} as ${type}`}`;
};

export const parseArrayType = (str: string): string => {
  return str.replace('[]', '');
};

export const isArrayType = (type: string): boolean => {
  return type.slice(-2) === '[]';
};

export const isBaseType = (type: string): boolean => {
  return (isArrayType(type) ? baseTypes[type.substring(0, type.length - 2)] : baseTypes[type]) || false;
};
