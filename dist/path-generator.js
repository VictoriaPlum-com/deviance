'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = generatePaths;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function generatePaths(settings, filename, testName, testModule) {
    const name = testName.replace(/[^a-z0-9]/gi, '-');
    const file = `${filename.replace(/[^a-z0-9]/gi, '-')}.png`;

    return {
        expected: _path2.default.join(settings.expectedPath, testModule, name, file),
        actual: _path2.default.join(settings.actualPath, testModule, name, file),
        diff: _path2.default.join(settings.actualPath, testModule, name, 'diff', file)
    };
}