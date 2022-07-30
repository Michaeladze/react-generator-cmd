import { exec } from 'child_process';

export function runLinter(path: string) {
  exec(`eslint ${path} --fix`);
}
