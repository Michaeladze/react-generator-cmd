const { routerConfigTemplate, routerTemplate, routerWithSubRoutesTemplate } = require('./templates');
const { mkDir, mkFile } = require('./mk');
const fs = require('fs');

function createRouter(answers, path) {
  path += '/router';
  mkDir(path);

  mkFile(`${path}/config.tsx`, routerConfigTemplate());
  mkFile(`${path}/Router.tsx`, routerTemplate());
  mkFile(`${path}/RouterWithSubRoutes.tsx`, routerWithSubRoutesTemplate());

  const indexPath = './src/index.tsx';
  fs.readFile(indexPath, { encoding: 'utf8' }, (err, data) => {
    if (err) {
      console.log(err)
      return;
    }
    const lines = data.split('\n');
    let lastImportIndex = 0;
    let hasRouterImport = false;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('import')) {
        lastImportIndex = i;

        if (!hasRouterImport && lines[i].includes('BrowserRouter')) {
          hasRouterImport = true;
        }
      }

      if (!hasRouterImport && lines[i].includes('<App')) {
        lines[i] = lines[i].replace(lines[i], `  <BrowserRouter>\n    ${ lines[i] }\n  </BrowserRouter>`)
      }
    }

    if (!hasRouterImport) {
      lines[lastImportIndex] = lines[lastImportIndex].replace(lines[lastImportIndex], `${lines[lastImportIndex]}\nimport { BrowserRouter } from 'react-router-dom';`)

      fs.writeFile(indexPath, lines.join('\n'), (err) => {
        if (err) {
          console.log(err)
        }
      });
    }
  });
}

module.exports = {
  createRouter
}