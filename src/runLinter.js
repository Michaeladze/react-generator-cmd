const { exec } = require('child_process');

function runLinter() {
  exec('eslint ./_store --fix');
}

module.exports = { runLinter };

