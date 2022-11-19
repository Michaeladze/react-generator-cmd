"use strict";
exports.__esModule = true;
var config_types_1 = require("../types/config.types");
exports.checkCondition = function (line, when) {
    var _a;
    if (when === undefined) {
        return true;
    }
    var map = (_a = {},
        _a[config_types_1.TemplateUpdateOperator.NotIncludes] = !line.includes(when[1]),
        _a[config_types_1.TemplateUpdateOperator.Includes] = line.includes(when[1]),
        _a[config_types_1.TemplateUpdateOperator.NotEqual] = line !== when[1],
        _a[config_types_1.TemplateUpdateOperator.Equal] = line === when[1],
        _a);
    return map[when[0]];
};
