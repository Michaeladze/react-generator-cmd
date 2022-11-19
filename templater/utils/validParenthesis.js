"use strict";
exports.__esModule = true;
exports.isValidParenthesis = function (s) {
    var map = {
        '}': '{',
        ']': '[',
        ')': '('
    };
    var chars = {
        '}': true,
        ']': true,
        ')': true,
        '{': true,
        '[': true,
        '(': true
    };
    var stack = [];
    for (var i = 0; i < s.length; i++) {
        if (!chars[s[i]]) {
            continue;
        }
        if (stack.length > 0 && stack[stack.length - 1] === map[s[i]]) {
            stack.pop();
            continue;
        }
        stack.push(s[i]);
    }
    return stack.length === 0;
};
