import * as fs from 'fs';

import { AnyFunction } from './types/common.types';

export const mkDir = (path: string) => {

  const pathArr = path.split('/').filter((s: string) => s !== '' && s !== '.');
  let p = '.';

  while (pathArr.length > 0) {
    const folder = pathArr.shift();
    p += `/${folder}`;

    if (!fs.existsSync(p)) {
      fs.mkdirSync(p);
    }
  }
};

export const mkFile = (path: string, data: string, cb?: AnyFunction) => {
  if (!fs.existsSync(path)) {
    fs.appendFileSync(path, data);
  } else {
    cb && cb();
  }
};

export const fileExists = (path: string) => {
  return fs.existsSync(path);
};

export const readDirSync = (path: string) => {
  return fs.readdirSync(path);
};

export const readFileSync = fs.readFileSync;
