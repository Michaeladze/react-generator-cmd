"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
exports.__esModule = true;
var fs = require("fs");
var path = require("path");
var createFile_1 = require("./createFile");
var hydrateFile_1 = require("./hydrateFile");
var updateFile_1 = require("./updateFile");
var runLinter_1 = require("../../src/runLinter");
var dynamicRequire_1 = require("../utils/dynamicRequire");
var logger_1 = require("../utils/logger");
var mk_1 = require("../utils/mk");
exports["default"] = (function (answers, config) {
    // console.log(answers);
    // console.log(config);
    config.domains[answers.$domainIndex].templates.forEach(function (templateConfig) { return __awaiter(_this, void 0, void 0, function () {
        var name_1, componentsPathNext, filePath_1, template, invoker_1, content;
        return __generator(this, function (_a) {
            try {
                if (templateConfig.when && !templateConfig.when(answers)) {
                    return [2 /*return*/];
                }
                name_1 = '';
                if (typeof templateConfig.name === 'string') {
                    name_1 = templateConfig.name;
                }
                else {
                    name_1 = templateConfig.name(answers);
                }
                componentsPathNext = name_1.includes(answers.$root) ? '' : answers.$createPath + '/';
                if (templateConfig.template) {
                    filePath_1 = path.join(componentsPathNext, name_1);
                    template = typeof templateConfig.template === 'string' ? templateConfig.template : templateConfig.template(answers);
                    invoker_1 = dynamicRequire_1.dynamicRequire(path.resolve(config.variables.root, template));
                    if (mk_1.fileExists(filePath_1)) {
                        fs.readFile(filePath_1, 'utf-8', function (err, data) {
                            if (err) {
                                logger_1.logger.info(err);
                                logger_1.logger.error('Error occurred while reading file', filePath_1);
                                return;
                            }
                            if (data && data.trim() === '') {
                                logger_1.logger.info("Re-init file " + filePath_1);
                                var content = invoker_1(answers).init;
                                hydrateFile_1.hydrateFile(filePath_1, content, function () {
                                    logger_1.logger.success('Created file', filePath_1);
                                    runLinter_1.runLinter(filePath_1);
                                });
                            }
                            else {
                                var updates = invoker_1(answers).updates;
                                if (updates) {
                                    logger_1.logger.info("Updating file " + filePath_1);
                                    updateFile_1.updateFile(filePath_1, updates, function () {
                                        logger_1.logger.success('Updated file', filePath_1);
                                        runLinter_1.runLinter(filePath_1);
                                    });
                                }
                            }
                        });
                    }
                    else {
                        logger_1.logger.info("Creating file " + filePath_1);
                        content = invoker_1(answers).init;
                        createFile_1.createFile(filePath_1, content, function () {
                            logger_1.logger.success('Created file', filePath_1);
                            runLinter_1.runLinter(filePath_1);
                        });
                    }
                }
            }
            catch (e) {
                logger_1.logger.error(e);
            }
            return [2 /*return*/];
        });
    }); });
});
