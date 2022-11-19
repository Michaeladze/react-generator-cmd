import { IIndexes } from '../types/config.types';
import { baseTypes } from '../utils/basicTypes';
import { logger } from '../utils/logger';

export const fixFile = (fileContent: string): string[] => {

  const fileLines: string[] = fileContent.split('\n');

  // [1] Fix basic types imports
  for (let i = fileLines.length - 1; i >= 0; i--) {

    try {
      if (fileLines[i].includes('import')) {
        const indexes: IIndexes = [-1, -1];
        let singleString = '';

        indexes[0] = i;

        for (let j = i; j < fileLines.length; j++) {
          for (let l = 0; l < fileLines[j].length; l++) {
            singleString += fileLines[j][l];
          }

          if (fileLines[j].includes('from')) {
            indexes[1] = j;
            break;
          }
        }

        let index = 0;
        const items = ['', '', ''];

        for (let j = 0; j < singleString.length; j++) {
          const c = singleString[j];

          if (c === '}') {
            index = 2;
          }

          items[index] += c;

          if (c === '{') {
            index = 1;
          }
        }

        items[1] = items[1]
          .split(',')
          .map((s: string) => s.trim())
          .filter((s: string) => s.slice(-2) === '[]' ? !baseTypes[s.substring(0, s.length - 2)] : !baseTypes[s])
          .map((s: string) => s.slice(-2) === '[]' ? s.substring(0, s.length - 2) : s)
          .join(',');

        if (indexes[0] !== -1 && indexes[1] !== -1) {
          const importString = items[1].trim() === '' ? '' : items.join(' ');
          fileLines.splice(indexes[0], indexes[1] - indexes[0] + 1, importString);
        }
      }
    } catch (e) {
      logger.dev('Error in fixFileAfterInsertion [1]');
      logger.error(e);
    }
  }

  // [2] Fix lines, that start with a comma
  try {
    for (let i = 0; i < fileLines.length; i++) {
      const trimmedLine = fileLines[i].trimStart();

      if (trimmedLine[0] === ',') {
        fileLines[i] = fileLines[i].replace(',', '');

        const prevLine = fileLines[i - 1];

        if (prevLine) {
          const trimmedPrevLine = prevLine.trimEnd();

          if (trimmedPrevLine[trimmedPrevLine.length - 1] !== ',') {
            fileLines[i - 1] = fileLines[i - 1] + ',';
          }
        }
      }
    }
  } catch (e) {
    logger.dev('Error in fixFileAfterInsertion [1]');
  }

  return fileLines;
};
