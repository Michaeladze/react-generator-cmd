"use strict";
exports.__esModule = true;
exports.dynamicRequire = function (path) {
    path = path.split('\\').join('/');
    return eval("require('" + path + "');");
};
