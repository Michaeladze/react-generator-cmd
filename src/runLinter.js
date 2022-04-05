const { exec } = require('child_process');

function runLinter(path) {
  exec(`eslint ${path} --fix`);
}

module.exports = { runLinter };

