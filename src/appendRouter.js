const fs = require('fs');

function appendRouter(componentName, answers, path, routerPath) {
  const importStr = `const ${ componentName } = lazy(() => import('.${ path }'));`;

  fs.readFile(routerPath, { encoding: 'utf8' }, (err, data) => {
    const lines = data.split('\n');

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('export const routes')) {
        lines[i - 2] = lines[i - 2] + '\n' + importStr;
      }
    }

    fs.writeFile(routerPath, lines.join('\n'), (err) => {
      if (err) {
        console.log(err);
      }
    });

  });

}

module.exports = {
  appendRouter
};
