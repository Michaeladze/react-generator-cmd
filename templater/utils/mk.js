"use strict";
exports.__esModule = true;
var fs = require("fs");
var logger_1 = require("./logger");
exports.mkDir = function (filePath) {
    try {
        var normalizedPath = exports.normalizePath(filePath);
        var pathArr = normalizedPath.split('/').filter(function (s) { return s !== '' && s !== '.'; });
        var p = '.';
        while (pathArr.length > 0) {
            var folder = pathArr.shift();
            p += "/" + folder;
            if (!fs.existsSync(p)) {
                fs.mkdirSync(p);
            }
        }
    }
    catch (e) {
        logger_1.logger.info(e);
        logger_1.logger.error('Error in mkDir() function');
    }
};
exports.mkFile = function (filePath, data, onCreate) {
    try {
        var normalizedPath = exports.normalizePath(filePath);
        if (!fs.existsSync(normalizedPath)) {
            var tmp = normalizedPath.split('/');
            var lastSlash = tmp.lastIndexOf('/');
            var pathToFile = tmp.slice(0, lastSlash).join('/');
            exports.mkDir(pathToFile);
            fs.appendFileSync(normalizedPath, data);
            onCreate && onCreate();
        }
        else {
            logger_1.logger.info("File already exists " + normalizedPath);
        }
    }
    catch (e) {
        logger_1.logger.info(e);
        logger_1.logger.error('Error in mkFile() function');
    }
};
exports.fileExists = function (filePath) {
    try {
        var normalizedPath = exports.normalizePath(filePath);
        return fs.existsSync(normalizedPath);
    }
    catch (e) {
        logger_1.logger.info(e);
        logger_1.logger.error('Error in fileExists() function');
    }
};
exports.readDirSync = function (path) {
    return fs.readdirSync(path);
};
exports.readFileSync = fs.readFileSync;
exports.normalizePath = function (filePath) {
    return filePath.replace(/\\/g, '/');
};
