const { interceptorTemplate } = require('./templates');
const { mkDir, mkFile } = require('./mk');
const fs = require('fs');

function createInterceptor(answers, path) {
  path += '/api';
  mkDir(path);

  mkFile(`${path}/interceptor.ts`, interceptorTemplate());
  mkFile(`./.env.development`, 'REACT_APP_HOST = http://localhost:3000');
  mkFile(`./.env.production`, 'REACT_APP_HOST = http://localhost:3000');

  fs.readFile('./package.json', { encoding: 'utf8' }, (err, data) => {
    if (err) {
      console.log(err)
      return;
    }
    const lines = data.split('\n');
    let hasEnv = false;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('"start":')) {
        if (lines[i].includes('--env.ENVIRONMENT=development')) {
          hasEnv = true;
          break;
        }
        lines[i] = lines[i].replace('",', ' --env.ENVIRONMENT=development",');
        break;
      }
    }

    if (!hasEnv) {
      fs.writeFile('./package.json', lines.join('\n'), (err) => {
        if (err) {
          console.log(err)
        }
      });
    }
  });
}

module.exports = {
  createInterceptor
}
