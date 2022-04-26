const fs = require('fs');

function appendRouter(componentName, answers, path, routerPath) {
  const importStr = `const ${ componentName } = lazy(() => import('${ path.replace('../', '') }'));`;

  fs.readFile(routerPath, { encoding: 'utf8' }, (err, data) => {
    const lines = data.split('\n');

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('export const routes')) {
        lines[i - 2] = lines[i - 2] + '\n' + importStr;
        break;
      }
    }

    const template = `{
        path: '${answers.route}',
        element: <Suspense fallback=''><${componentName}/></Suspense>
    },`;

    for (let i = lines.length -1; i >= 0; i--) {
      if (lines[i] === '];') {
        lines[i] = template + '\n' + lines[i];
        break;
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
