"use strict";
exports.__esModule = true;
var fs = require("fs");
var fixFile_1 = require("./fixFile");
var logger_1 = require("../utils/logger");
exports.hydrateFile = function (filePath, content, onComplete) {
    try {
        var fixedLines = fixFile_1.fixFile(content);
        var fixedContent = fixedLines.join('\n').trim();
        fs.writeFile(filePath, fixedContent, function (e) {
            if (e) {
                logger_1.logger.info(e);
                logger_1.logger.error('Error in hydrateFile() function');
                return;
            }
            onComplete && onComplete();
        });
    }
    catch (e) {
        logger_1.logger.info(e);
        logger_1.logger.error('Error in hydrateFile() function');
    }
};
