"use strict";
exports.__esModule = true;
var checkCondition_1 = require("./checkCondition");
var fixFile_1 = require("./fixFile");
var config_types_1 = require("../types/config.types");
exports.insert = function (data, updates) {
    var lines = data.split('\n');
    updates_loop: for (var j = 0; j < updates.length; j++) {
        var u = updates[j];
        if (!u.direction) {
            u.direction = config_types_1.TemplateUpdateDirection.Down;
        }
        var indexes = findIndexes(lines, u);
        var fromIndex = indexes[0], toIndex = indexes[1];
        if ((fromIndex === -1 || toIndex === -1) && u.fallback) {
            updates.push(u.fallback);
            continue;
        }
        if (u.direction === config_types_1.TemplateUpdateDirection.Down) {
            if (checkInsertCondition(lines, indexes, u)) {
                for (var i = fromIndex; i < toIndex; i++) {
                    if (checkCondition_1.checkCondition(lines[i], u.searchFor)) {
                        lines[i] = lines[i].replace(u.searchFor[1], u.changeWith);
                        continue updates_loop;
                    }
                }
            }
        }
        else {
            if (checkInsertCondition(lines, indexes, u)) {
                for (var i = fromIndex; i >= toIndex; i--) {
                    if (checkCondition_1.checkCondition(lines[i], u.searchFor)) {
                        lines[i] = lines[i].replace(u.searchFor[1], u.changeWith);
                        continue updates_loop;
                    }
                }
            }
        }
    }
    var fileContent = lines.join('\n');
    return fixFile_1.fixFile(fileContent).join('\n');
};
function checkInsertCondition(lines, indexes, u) {
    var _a = findIndexes(lines, u), fromIndex = _a[0], toIndex = _a[1];
    // [1] Single line
    if (fromIndex === toIndex) {
        return checkCondition_1.checkCondition(lines[fromIndex], u.when);
    }
    // [2] Multiple lines
    if (u.direction === config_types_1.TemplateUpdateDirection.Down) {
        for (var i = fromIndex; i < toIndex; i++) {
            if (!checkCondition_1.checkCondition(lines[i], u.when)) {
                return false;
            }
        }
    }
    else {
        for (var i = fromIndex; i >= toIndex; i--) {
            if (!checkCondition_1.checkCondition(lines[i], u.when)) {
                return false;
            }
        }
    }
    return true;
}
function findIndexes(lines, u) {
    var indexes = [-1, -1];
    var isDown = u.direction === config_types_1.TemplateUpdateDirection.Down;
    if (isDown) {
        if (u.fromLine === undefined) {
            indexes[0] = 0;
        }
        if (u.toLine === undefined) {
            indexes[1] = lines.length - 1;
        }
    }
    else {
        if (u.fromLine === undefined) {
            indexes[0] = lines.length - 1;
        }
        if (u.toLine === undefined) {
            indexes[1] = 0;
        }
    }
    if (indexes[0] !== -1 && indexes[1] !== -1) {
        return indexes;
    }
    function checkIndexes(lines, i, u, indexes) {
        if (indexes[0] === -1 && u.fromLine && checkCondition_1.checkCondition(lines[i], u.fromLine)) {
            indexes[0] = i;
        }
        if (indexes[1] === -1 && u.toLine && checkCondition_1.checkCondition(lines[i], u.toLine)) {
            indexes[1] = i;
        }
        return indexes[0] !== -1 && indexes[1] !== -1;
    }
    if (isDown) {
        for (var i = 0; i < lines.length; i++) {
            if (checkIndexes(lines, i, u, indexes)) {
                return indexes;
            }
        }
        // if (indexes[0] === -1) {
        //   indexes[0] = 0;
        // }
        //
        // if (indexes[1] === -1) {
        //   indexes[1] = lines.length - 1;
        // }
    }
    else {
        for (var i = lines.length - 1; i >= 0; i--) {
            if (checkIndexes(lines, i, u, indexes)) {
                return indexes;
            }
        }
        // if (indexes[0] === -1) {
        //   indexes[0] = lines.length - 1;
        // }
        //
        // if (indexes[1] === -1) {
        //   indexes[1] = 0;
        // }
    }
    return indexes;
}
