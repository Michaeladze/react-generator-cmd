"use strict";
exports.__esModule = true;
exports.logger = {
    info: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.log.apply(console, ['\x1b[33m%s\x1b[0m'].concat(args));
    },
    success: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.log.apply(console, ['\x1b[32m%s\x1b[0m'].concat(args));
    },
    error: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.log.apply(console, ['\x1b[31m%s\x1b[0m'].concat(args));
    },
    dev: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.log.apply(console, ['\x1b[36m%s\x1b[0m'].concat(args));
    }
};
