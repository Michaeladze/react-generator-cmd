const { styleLintTemplate } = require('./templates/general/styleLint');
const { mkFile } = require('./mk');
const { exec } = require('child_process');

function createStyleLint() {
  exec('yarn add -D stylelint stylelint-config-sass-guidelines stylelint-config-standard',
    (err, stdout, stderr) => {

    mkFile(`.stylelintrc.json`, styleLintTemplate());

    if (err) {
      return;
    }

    // the *entire* stdout and stderr (buffered)
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });
}

module.exports = {
  createStyleLint
}
