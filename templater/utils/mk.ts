import * as fs from 'fs';

import { logger } from './logger';

import { AnyFunction } from '../types/common.types';

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

export const mkFile = (path: string, data: string, onCreate?: AnyFunction) => {
  if (!fs.existsSync(path)) {
    const tmp = path.split('/');
    const lastSlash = tmp.lastIndexOf('/');
    const pathToFile = tmp.slice(0, lastSlash).join('/');
    mkDir(pathToFile);

    fs.appendFileSync(path, data);
    onCreate && onCreate();
  } else {
    logger.info(`File already exists ${path}`);
  }
};

export const fileExists = (path: string) => {
  return fs.existsSync(path);
};

export const readDirSync = (path: string) => {
  return fs.readdirSync(path);
};

export const readFileSync = fs.readFileSync;
