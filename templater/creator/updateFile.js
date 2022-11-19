"use strict";
exports.__esModule = true;
var fs = require("fs");
var insert_1 = require("./insert");
var logger_1 = require("../utils/logger");
exports.updateFile = function (path, updates, onComplete) {
    fs.readFile(path, {
        encoding: 'utf8'
    }, function (err, data) {
        if (err) {
            logger_1.logger.info(err);
            logger_1.logger.error('Error in updateFile() function');
            return;
        }
        var content = insert_1.insert(data, updates).trim();
        fs.writeFile(path, content, function (err) {
            if (err) {
                logger_1.logger.info(err);
                logger_1.logger.error('Error in updateFile() function');
            }
            else {
                onComplete && onComplete();
            }
        });
    });
};
