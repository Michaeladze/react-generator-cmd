"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var path = require("path");
var dynamicRequire_1 = require("./dynamicRequire");
var logger_1 = require("./logger");
var mk_1 = require("./mk");
var parseConfigQuestions_1 = require("./parseConfigQuestions");
var defaultConfig = {
    variables: {
        root: './'
    },
    domains: []
};
function readJSON() {
    var location = '../../../';
    var file = path.resolve(__dirname, location, 'g.js');
    logger_1.logger.info("Reading file " + file);
    var GJSONExists = mk_1.fileExists(file);
    if (!GJSONExists) {
        logger_1.logger.info('g.js not found. Using default config.');
        return defaultConfig;
    }
    var json = dynamicRequire_1.dynamicRequire(file);
    if (!json) {
        return defaultConfig;
    }
    var parsedJSON = parseConfigQuestions_1.parseConfigQuestions(json);
    var result = __assign({}, defaultConfig, parsedJSON);
    return result;
}
exports.readJSON = readJSON;
