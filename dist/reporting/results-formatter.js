'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Formatter;

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

var _ansi_up = require('ansi_up');

var _ansi_up2 = _interopRequireDefault(_ansi_up);

var _pathGenerator = require('../path-generator');

var _pathGenerator2 = _interopRequireDefault(_pathGenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Formatter(settings) {
    const ansiUp = new _ansi_up2.default();

    function format(results) {
        results.requiresApproval = [];

        const re = /Deviance regression .*{(.*)}/;
        Object.entries(results.modules).forEach(([testModule, { completed, errmessages }]) => {
            results.modules[testModule].htmlErrorMsgs = [];
            Object.entries(completed).forEach(([testName, { assertions }]) => {
                assertions.forEach(assertion => {
                    [assertion.message] = assertion.message.split(' - expected');
                    const match = assertion.fullMsg.match(re);

                    if (match === null) {
                        return;
                    }

                    const [, fileName] = match;

                    assertion.message = assertion.message.replace(/{.*}/, '');

                    assertion.devianceId = (0, _v2.default)();
                    assertion.devianceFilePath = (0, _pathGenerator2.default)(settings, fileName, testName, testModule);

                    assertion.isPassedDeviance = false;
                    const diffExists = _fsExtra2.default.existsSync(assertion.devianceFilePath.diff);
                    if (!assertion.failure && diffExists) {
                        assertion.isPassedDeviance = true;
                        assertion.isNewDeviance = false;
                        return;
                    }

                    results.requiresApproval[assertion.devianceId] = assertion;
                    assertion.isNewDeviance = !diffExists;
                });
            });

            if (errmessages) {
                errmessages.forEach(message => {
                    const htmlErrorMessage = ansiUp.ansi_to_html(message);
                    results.modules[testModule].htmlErrorMsgs.push(htmlErrorMessage);
                });
            }
        });

        return results;
    }

    return { format };
}