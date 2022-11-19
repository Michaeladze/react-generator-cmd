"use strict";
exports.__esModule = true;
var fixFile_1 = require("./fixFile");
var logger_1 = require("../utils/logger");
var mk_1 = require("../utils/mk");
exports.createFile = function (filePath, content, onComplete) {
    try {
        var fixedLines = fixFile_1.fixFile(content);
        var fixedContent = fixedLines.join('\n').trim();
        if (fixedContent === '') {
            return;
        }
        mk_1.mkFile(filePath, fixedContent, function () {
            onComplete && onComplete();
        });
    }
    catch (e) {
        logger_1.logger.info(e);
        logger_1.logger.error('Error in createFile() function');
    }
};
