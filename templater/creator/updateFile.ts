import * as fs from 'fs';

import { checkCondition } from './checkCondition';

import {
  ITemplateUpdate,
  TemplateUpdateDirection
} from '../types/config.types';

export const updateFile = (path: string, updates: ITemplateUpdate[]) => {
  fs.readFile(path, {
    encoding: 'utf8'
  }, (err, data) => {
    const lines: string[] = data.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      updates.forEach((u: ITemplateUpdate) => {

        if (line.includes(u.startFromLineThatContains)) {
          if (!u.direction || u.direction === TemplateUpdateDirection.Down) {
            for (let l = i; l < lines.length; l++) {

              if (lines[l].includes(u.searchFor) && checkCondition(lines[l], u.whenLine)) {
                lines[l] = lines[l].replace(u.searchFor, u.changeWith);
                break;
              }
            }
          } else {
            for (let l = i; l >= 0; l--) {

              if (lines[l].includes(u.searchFor) && checkCondition(lines[l], u.whenLine)) {
                lines[l] = lines[l].replace(u.searchFor, u.changeWith);
                break;
              }
            }
          }
        }

      });
    }

    const content = lines.join('\n');

    fs.writeFile(path, content, (err) => {
      if (err) {
        console.log(err);
      }
    });
  });
};
