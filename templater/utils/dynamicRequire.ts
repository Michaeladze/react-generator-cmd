export const dynamicRequire = (path: string) => {
  path = path.split('\\').join('/');
  return eval(`require('${path}');`);
};
