const { esLintTemplate } = require('./templates/general/esLint');
const { mkFile } = require('./mk');
const { exec } = require('child_process');

function createEsLint() {
  exec('yarn add -D eslint-plugin-unused-imports', (err, stdout, stderr) => {

    mkFile(`.eslintrc.json`, esLintTemplate());

    if (err) {
      return;
    }

    // the *entire* stdout and stderr (buffered)
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });
}

module.exports = {
  createEsLint
}
