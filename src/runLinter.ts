import { exec } from 'child_process';

import { logger } from '../templater/utils/logger';

export function runLinter(path: string) {
  logger.info(`Running linter for ${path}`);
  exec(`eslint ${path} --fix`);
}
