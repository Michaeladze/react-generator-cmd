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

const fileExists = (path) => {
  return fs.existsSync(path);
}

const readDirSync = (path) => {
  return fs.readdirSync(path);
}

const readFileSync = fs.readFileSync;

module.exports = {
  mkDir, mkFile, fileExists, readDirSync, readFileSync
}
