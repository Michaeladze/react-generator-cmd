import { fixFile } from './fixFile';

import { runLinter } from '../../src/runLinter';
import { AnyFunction } from '../types/common.types';
import { logger } from '../utils/logger';
import { mkFile } from '../utils/mk';

export const createFile = (filePath: string, content: string, onCreate?: AnyFunction) => {
  try {

    const lines = content.split('\n');
    const fixedLines = fixFile(lines);
    const fixedContent = fixedLines.join('\n');

    mkFile(filePath, fixedContent, () => {
      logger.success('Created file', filePath);
      runLinter(filePath);
    });
  } catch (e) {
    logger.info(e);
    logger.error('Error in createFile() function');
  }
};
