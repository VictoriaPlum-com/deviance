'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = generatePaths;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function replaceNonAlphaNumeric(value) {
    return value.replace(/[^a-z0-9]/gi, '-');
}

function generatePaths(settings, filename, testName, testModule) {
    const name = replaceNonAlphaNumeric(testName);
    const file = `${replaceNonAlphaNumeric(filename)}.png`;

    return {
        expected: _path2.default.join(settings.expectedPath, testModule, name, file),
        actual: _path2.default.join(settings.actualPath, testModule, name, file),
        diff: _path2.default.join(settings.actualPath, testModule, name, 'diff', file)
    };
}