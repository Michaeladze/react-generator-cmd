"use strict";
exports.__esModule = true;
var basicTypes_1 = require("../utils/basicTypes");
var logger_1 = require("../utils/logger");
var validParenthesis_1 = require("../utils/validParenthesis");
exports.fixFile = function (fileContent) {
    var fileLines = fileContent.split('\n');
    fixBasicTypeImports(fileLines);
    fixBasicTypeExports(fileLines);
    fixLinesThatStartWithComma(fileLines);
    return fileLines;
};
function fixBasicTypeExports(fileLines) {
    try {
        var typeExportsCount = {};
        for (var i = 0; i < fileLines.length; i++) {
            var exportsInterface = fileLines[i].includes('export interface');
            var exportsType = fileLines[i].includes('export type');
            if (!exportsInterface && !exportsType) {
                continue;
            }
            var split = fileLines[i].split(' ');
            if (split && split[2]) {
                var type = basicTypes_1.isArrayType(split[2]) ? split[2].substring(0, split[2].length - 2) : split[2];
                if (typeExportsCount[type] === undefined) {
                    typeExportsCount[type] = 0;
                }
                typeExportsCount[type]++;
            }
        }
        for (var i = fileLines.length - 1; i >= 0; i--) {
            var exportsInterface = fileLines[i].includes('export interface');
            var exportsType = fileLines[i].includes('export type');
            if (!exportsInterface && !exportsType) {
                continue;
            }
            var indexes = [-1, -1];
            var singleString = '';
            indexes[0] = i;
            indexes_loop: for (var j = i; j < fileLines.length; j++) {
                for (var l = 0; l < fileLines[j].length; l++) {
                    singleString += fileLines[j][l];
                    if (exportsInterface && fileLines[j][l] === '}' && validParenthesis_1.isValidParenthesis(singleString)) {
                        indexes[1] = j;
                        break indexes_loop;
                    }
                    if (exportsType && fileLines[j][l] === ';') {
                        indexes[1] = j;
                        break indexes_loop;
                    }
                }
            }
            var splitExport = singleString.split(' ');
            var type = splitExport[2];
            if (indexes[0] !== -1 && indexes[1] !== -1) {
                if (basicTypes_1.isBaseType(type)) {
                    fileLines.splice(indexes[0], indexes[1] - indexes[0] + 1);
                    continue;
                }
                if (basicTypes_1.isArrayType(type)) {
                    type = type.replace('[]', '');
                    if (typeExportsCount[type] > 1) {
                        fileLines.splice(indexes[0], indexes[1] - indexes[0] + 1);
                        typeExportsCount[type]--;
                    }
                    else {
                        splitExport[2] = type;
                        fileLines.splice(indexes[0], indexes[1] - indexes[0] + 1, splitExport.join(' '));
                    }
                }
            }
        }
    }
    catch (e) {
        logger_1.logger.dev('Error in fixBasicTypeExports');
        logger_1.logger.error(e);
    }
}
function fixBasicTypeImports(fileLines) {
    for (var i = fileLines.length - 1; i >= 0; i--) {
        try {
            if (fileLines[i].includes('import')) {
                var indexes = [-1, -1];
                var singleString = '';
                indexes[0] = i;
                for (var j = i; j < fileLines.length; j++) {
                    for (var l = 0; l < fileLines[j].length; l++) {
                        singleString += fileLines[j][l];
                    }
                    if (fileLines[j].includes('from')) {
                        indexes[1] = j;
                        break;
                    }
                }
                var index = 0;
                var items = ['', '', ''];
                for (var j = 0; j < singleString.length; j++) {
                    var c = singleString[j];
                    if (c === '}') {
                        index = 2;
                    }
                    items[index] += c;
                    if (c === '{') {
                        index = 1;
                    }
                }
                if (items[1] === '') {
                    continue;
                }
                items[1] = items[1]
                    .split(',')
                    .map(function (s) { return s.trim(); })
                    .filter(function (s) { return !basicTypes_1.isBaseType(s); })
                    .map(function (s) { return basicTypes_1.isArrayType(s) ? s.substring(0, s.length - 2) : s; })
                    .join(',');
                if (indexes[0] !== -1 && indexes[1] !== -1) {
                    var importString = items[1].trim() === '' ? '' : items.join(' ');
                    fileLines.splice(indexes[0], indexes[1] - indexes[0] + 1, '\n' + importString);
                }
            }
        }
        catch (e) {
            logger_1.logger.dev('Error in fixBasicTypeImports');
            logger_1.logger.error(e);
        }
    }
}
function fixLinesThatStartWithComma(fileLines) {
    try {
        for (var i = 0; i < fileLines.length; i++) {
            var trimmedLine = fileLines[i].trimStart();
            if (trimmedLine[0] === ',') {
                fileLines[i] = fileLines[i].replace(',', '');
                var prevLine = fileLines[i - 1];
                if (prevLine) {
                    var trimmedPrevLine = prevLine.trimEnd();
                    if (trimmedPrevLine[trimmedPrevLine.length - 1] !== ',') {
                        fileLines[i - 1] = fileLines[i - 1] + ',';
                    }
                }
            }
        }
    }
    catch (e) {
        logger_1.logger.dev('Error in fixLinesThatStartWithComma');
    }
}
