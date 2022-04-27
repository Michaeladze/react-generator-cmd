const fs = require('fs');

const mkDir = (path) => {

  const pathArr = path.split('/').filter((s) => s !== '' && s !== '.');
  let p = '.';

  while (pathArr.length > 0) {
    const folder = pathArr.shift();
    p += `/${ folder }`;

    if (!fs.existsSync(p)) {
      fs.mkdirSync(p);
    }
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
