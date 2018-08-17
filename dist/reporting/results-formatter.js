'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Formatter;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

var _pathGenerator = require('../path-generator');

var _pathGenerator2 = _interopRequireDefault(_pathGenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Formatter(settings) {
    function format(results) {
        results.requiresApproval = [];

        const re = /Deviance regression .*<(.*)>/;
        Object.entries(results.modules).forEach(([testModule, { completed }]) => {
            Object.entries(completed).forEach(([testName, { assertions }]) => {
                assertions.forEach(assertion => {
                    [assertion.message] = assertion.message.split(' - expected');
                    const match = assertion.fullMsg.match(re);
                    if (match === null) {
                        return;
                    }

                    const [, fileName] = match;

                    assertion.devianceId = (0, _v2.default)();
                    assertion.devianceFilePath = (0, _pathGenerator2.default)(settings, fileName, testName, testModule);

                    assertion.isPassedDeviance = false;
                    const diffExists = _fs2.default.existsSync(assertion.devianceFilePath.diff);
                    if (!assertion.failure && diffExists) {
                        assertion.isPassedDeviance = true;
                        assertion.isNewDeviance = false;
                        return;
                    }

                    results.requiresApproval[assertion.devianceId] = assertion;
                    assertion.isNewDeviance = !diffExists;
                });
            });
        });

        return results;
    }

    return { format };
}