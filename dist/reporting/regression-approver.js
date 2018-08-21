'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = approve;

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function approve(assertion) {
    const { expected, actual, diff } = assertion.devianceFilePath;

    if (!assertion.isNewDeviance) {
        _fsExtra2.default.unlinkSync(diff);
        _fsExtra2.default.unlinkSync(expected);
        assertion.devianceFilePath.diff = null;
    }

    _fsExtra2.default.ensureDirSync(_path2.default.dirname(expected));
    _fsExtra2.default.renameSync(actual, expected);

    assertion.devianceFilePath.actual = null;
    assertion.failure = false;
    assertion.isNewDeviance = false;

    assertion.message = assertion.message.replace('(fail)', '(approved)');
    assertion.message = assertion.message.replace('(new)', '(approved)');
}