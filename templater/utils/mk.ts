import * as fs from 'fs';

import { logger } from './logger';

import { AnyFunction } from '../types/common.types';

export const mkDir = (path: string) => {
  try {
    const pathArr = path.split('/').filter((s: string) => s !== '' && s !== '.');
    let p = '.';

    while (pathArr.length > 0) {
      const folder = pathArr.shift();
      p += `/${folder}`;

      if (!fs.existsSync(p)) {
        fs.mkdirSync(p);

      }
    }
  } catch (e) {
    logger.info(e);
    logger.error('Error in mkDir() function');
  }
};

export const mkFile = (path: string, data: string, onCreate?: AnyFunction) => {
  try {
    if (!fs.existsSync(path)) {
      const tmp = path.split('/');
      const lastSlash = tmp.lastIndexOf('/');
      const pathToFile = tmp.slice(0, lastSlash).join('/');
      console.log('mkDir', pathToFile);
      mkDir(pathToFile);
      console.log('appendFileSync', path);

      fs.appendFileSync(path, data);
      onCreate && onCreate();
    } else {
      logger.info(`File already exists ${path}`);
    }
  } catch (e) {
    logger.info(e);
    logger.error('Error in mkFile() function');
  }
};

export const fileExists = (path: string) => {
  try {
    return fs.existsSync(path);
  } catch (e) {
    logger.info(e);
    logger.error('Error in fileExists() function');
  }
};

export const readDirSync = (path: string) => {
  return fs.readdirSync(path);
};

export const readFileSync = fs.readFileSync;
