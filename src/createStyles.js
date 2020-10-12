const { commonStylesTemplate, colorsStylesTemplate, mixinsStylesTemplate, indexStylesTemplate } = require('./styleTemplates');
const { mkDir, mkFile } = require('./mk');

function createStyles(answers, path) {
  path += '/styles';
  mkDir(path);

  mkFile(`${path}/common.scss`, commonStylesTemplate());
  mkFile(`${path}/colors.scss`, colorsStylesTemplate());
  mkFile(`${path}/mixins.scss`, mixinsStylesTemplate());
  mkFile(`${path}/index.scss`, indexStylesTemplate());
}

module.exports = {
  createStyles
}
