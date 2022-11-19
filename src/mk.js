"use strict";
exports.__esModule = true;
var fs = require("fs");
exports.mkDir = function (path) {
    var pathArr = path.split('/').filter(function (s) { return s !== '' && s !== '.'; });
    var p = '.';
    while (pathArr.length > 0) {
        var folder = pathArr.shift();
        p += "/" + folder;
        if (!fs.existsSync(p)) {
            fs.mkdirSync(p);
        }
    }
};
exports.mkFile = function (path, data, cb) {
    if (!fs.existsSync(path)) {
        fs.appendFileSync(path, data);
    }
    else {
        cb && cb();
    }
};
exports.fileExists = function (path) {
    return fs.existsSync(path);
};
exports.readDirSync = function (path) {
    return fs.readdirSync(path);
};
exports.readFileSync = fs.readFileSync;
