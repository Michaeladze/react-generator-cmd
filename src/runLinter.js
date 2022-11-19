"use strict";
exports.__esModule = true;
var child_process_1 = require("child_process");
var logger_1 = require("../templater/utils/logger");
function runLinter(path) {
    logger_1.logger.info("Running linter for " + path);
    child_process_1.exec("eslint " + path + " --fix");
}
exports.runLinter = runLinter;
