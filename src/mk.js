const fs = require('fs');

const mkDir = (path) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
};

const mkFile = (path, data, cb) => {
  if (!fs.existsSync(path)) {
    fs.appendFileSync(path, data);
  } else {
    cb && cb();
  }
};

function replaceParentheses(str) {
  return str.replace('[]', '');
}

module.exports = {
  mkDir, mkFile, replaceParentheses
}
