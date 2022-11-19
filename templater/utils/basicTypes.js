"use strict";
exports.__esModule = true;
exports.baseTypes = {
    number: true,
    string: true,
    boolean: true,
    any: true,
    "void": true,
    "null": true,
    undefined: true
};
exports.baseTypesArray = [
    'number',
    'string',
    'boolean',
    'any',
    'void',
    'null',
    'undefined'
];
exports.basicTypesTestPayload = {
    number: 1,
    string: '\'Test\'',
    boolean: true,
    any: true,
    "void": undefined,
    "null": null,
    undefined: undefined
};
exports.getTestPayload = function (type) {
    if (type.includes('[]')) {
        return '[]';
    }
    if (type === '') {
        return undefined;
    }
    return "" + (exports.basicTypesTestPayload[type] || "{} as " + type);
};
exports.parseArrayType = function (str) {
    return str.replace('[]', '');
};
exports.isArrayType = function (type) {
    return type.slice(-2) === '[]';
};
exports.isBaseType = function (type) {
    return (exports.isArrayType(type) ? exports.baseTypes[type.substring(0, type.length - 2)] : exports.baseTypes[type]) || false;
};
