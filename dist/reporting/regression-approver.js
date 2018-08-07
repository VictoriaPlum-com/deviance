'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = approve;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function approve(assertion) {
    const { expected, actual, diff } = assertion.filePath;

    _fs2.default.unlinkSync(diff);
    _fs2.default.unlinkSync(expected);
    _fs2.default.renameSync(actual, expected);

    assertion.filePath.diff = null;
    assertion.filePath.actual = null;
    assertion.failure = false;

    assertion.message.replace('(fail)', '(approved)');
}