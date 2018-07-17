'use strict';

var _htmlReporter = require('./reporting/html-reporter');

var _htmlReporter2 = _interopRequireDefault(_htmlReporter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = class Deviance {
    static reporter(results, done) {
        _htmlReporter2.default.write(results, done);
    }
};