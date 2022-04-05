const { huskyTemplate } = require('./templates/general/husky');
const fs = require('fs');
const { exec } = require('child_process');

function createHusky() {

  exec('yarn add -D lint-staged',
    (err, stdout, stderr) => {

      fs.readFile('./package.json', { encoding: 'utf8' }, (err, data) => {
        if (err) {
          console.log(err);
          return;
        }

        const lines = data.split('\n');

        for (let i = lines.length - 1; i >= 0; i--) {
          if (lines[i].includes('}')) {
            if (lines[i - 1].includes('}')) {
              lines[i - 1] = lines[i - 1].replace('}', '},')
            }
            lines[i] = lines[i].replace('}', huskyTemplate() + '\n}')
            break;
          }
        }

        fs.writeFile('./package.json', lines.join('\n'), (err) => {
          if (err) {
            console.log(err)
          }
        });
      });

      if (err) {
        return;
      }

      // the *entire* stdout and stderr (buffered)
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
    });
}

module.exports = {
  createHusky
}
