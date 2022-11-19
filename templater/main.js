"use strict";
exports.__esModule = true;
var inquirer_1 = require("inquirer");
var rxjs_1 = require("rxjs");
var creator_1 = require("./creator");
var readJSON_1 = require("./utils/readJSON");
var validateJSON_1 = require("./utils/validateJSON");
var mk_1 = require("../src/mk");
var types_1 = require("../src/types/types");
exports.main = function () {
    var config = readJSON_1.readJSON();
    var isValidConfig = validateJSON_1.validateJSON(config);
    if (!isValidConfig) {
        console.error('Invalid config');
        process.exit(0);
    }
    var structure = {};
    var depth = 1;
    var nextKey = undefined;
    var dynamicKey = undefined;
    var answers = {
        $domainIndex: -1,
        $createPath: config.variables.root || ''
    };
    if (config.variables) {
        Object.keys(config.variables).forEach(function (key) {
            // @ts-ignore
            answers["$" + key] = config.variables[key];
        });
    }
    var initialChoices = config.domains.map(function (d) {
        return {
            name: d.name
        };
    });
    var prompts = new rxjs_1.Subject();
    var userPrompts = new rxjs_1.Subject();
    // @ts-ignore
    inquirer_1["default"].prompt(rxjs_1.concat(prompts, userPrompts)).ui.process.subscribe(function (q) {
        answers[q.name] = q.answer;
        // Terminate
        try {
            if (answers.$domainIndex >= 0 && config.domains) {
                var questions = config.domains[answers.$domainIndex].questions;
                var lastQuestion = questions[questions.length - 1];
                // next question is invisible and is last question
                var currentQuestionIndex = questions.findIndex(function (qu) { return qu.name === q.name; });
                var nextQuestion = questions[currentQuestionIndex + 1];
                var isNextQuestionLast = lastQuestion.name === nextQuestion ? .name : ;
                var isNextQuestionVisible = true;
                if (nextQuestion ? .when !== undefined : ) {
                    if (typeof nextQuestion.when === 'boolean') {
                        isNextQuestionVisible = nextQuestion.when;
                    }
                    else {
                        isNextQuestionVisible = nextQuestion.when(answers);
                    }
                }
                var nextQuestions = [];
                var noMoreVisibleQuestions = false;
                for (var i = currentQuestionIndex; i < questions.length; i++) {
                    if (nextQuestion ? .when !== undefined : ) {
                        if (typeof nextQuestion.when === 'boolean') {
                            nextQuestions.push(nextQuestion.when);
                        }
                        else {
                            nextQuestions.push(nextQuestion.when(answers));
                        }
                    }
                }
                noMoreVisibleQuestions = prompts.isStopped && nextQuestions.every(function (isVisible) { return !isVisible; });
                if (q.name === lastQuestion.name || (isNextQuestionLast && !isNextQuestionVisible) || noMoreVisibleQuestions) {
                    userPrompts.complete();
                    return;
                }
            }
        }
        catch (e) {
            throw new Error('could not terminate');
        }
        // -----------------------------------------------------------------------------------------------------------------
        if (prompts.isStopped) {
            return;
        }
        if (q.name === types_1.Question.Create) {
            try {
                var domain_1 = initialChoices.find(function (_a) {
                    var name = _a.name;
                    return name === q.answer;
                });
                answers.$domainIndex = config.domains.findIndex(function (d) { return d.name === domain_1 ? .name : ; });
                if (answers.$domainIndex >= 0) {
                    var str = config.domains[answers.$domainIndex].structure;
                    structure = !str || Object.keys(str).length === 0 ? '' : str;
                }
                else {
                    prompts.complete();
                    userPrompts.complete();
                    return;
                }
            }
            catch (e) {
                throw new Error('Could not define the domain');
            }
            // const currentKeys = Object.keys(structure);
            //
            // if (currentKeys.length === 1) {
            //   nextKey = currentKeys[0];
            //   answers.$createPath += `/${nextKey}`;
            //   structure = structure[nextKey];
            // }
            try {
                if (typeof structure === 'string') {
                    prompts.complete();
                    config.domains[answers.$domainIndex].questions.forEach(function (q) {
                        userPrompts.next(q);
                    });
                    return;
                }
            }
            catch (e) {
                throw new Error('Could not complete prompts');
            }
            try {
                var keys = structure ? Object.keys(structure) : [];
                dynamicKey = keys.find(function (k) { return k[0] === ':'; }) || undefined;
                prompts.next({
                    type: 'list',
                    name: "components_" + depth,
                    message: 'Where to create a file?',
                    choices: function () {
                        if (dynamicKey) {
                            var dir = [];
                            if (mk_1.fileExists(answers.$createPath)) {
                                dir = mk_1.readDirSync(answers.$createPath);
                            }
                            return [types_1.Answer.CreateNew].concat(dir);
                        }
                        return Object.keys(structure);
                    }
                });
            }
            catch (e) {
                throw new Error('1');
            }
            return;
        }
        depth++;
        if (q.answer === types_1.Answer.CreateNew) {
            prompts.next({
                type: 'input',
                name: "components_" + depth,
                message: 'How to name folder?',
                validate: function (input) { return input !== ''; }
            });
            return;
        }
        try {
            nextKey = dynamicKey || q.answer;
            answers.$createPath += "/" + q.answer;
            structure = structure[nextKey];
            var keys = structure ? Object.keys(structure) : [];
            dynamicKey = keys.find(function (k) { return k[0] === ':'; }) || undefined;
            // if (keys.length === 1 && !dynamicKey) {
            //   nextKey = keys[0];
            //   answers.$createPath += `/${nextKey}`;
            //   structure = structure[nextKey];
            // }
        }
        catch (e) {
            throw new Error('Could not generate dynamic structure');
        }
        try {
            if (typeof structure === 'string') {
                prompts.complete();
                config.domains[answers.$domainIndex].questions.forEach(function (q) {
                    userPrompts.next(q);
                });
                return;
            }
        }
        catch (e) {
            throw new Error('Could not complete prompts');
        }
        try {
            prompts.next({
                type: 'list',
                name: "components_" + depth,
                message: 'Where to create a file?',
                choices: function () {
                    if (dynamicKey) {
                        var dir = [];
                        if (mk_1.fileExists(answers.$createPath)) {
                            dir = mk_1.readDirSync(answers.$createPath);
                        }
                        return [types_1.Answer.CreateNew].concat(dir);
                    }
                    return Object.keys(structure);
                }
            });
        }
        catch (e) {
            throw new Error('Could not generate dynamic structure');
        }
    }, function (error) {
        console.log(error);
    }, function () {
        answers.$createPath = answers.$createPath.split('/').filter(function (s) { return s !== ''; }).join('/');
        creator_1["default"](answers, config);
    });
    prompts.next({
        type: 'list',
        name: types_1.Question.Create,
        message: 'What needs to be created?',
        choices: initialChoices
    });
};
