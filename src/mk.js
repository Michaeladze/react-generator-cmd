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

module.exports = {
  mkDir, mkFile
}
