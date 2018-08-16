'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = jimpifyScreenshots;

var _jimp = require('jimp');

var _jimp2 = _interopRequireDefault(_jimp);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _helpers = require('../../helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function jimpifyScreenshots(api, selector, filenames) {
    return new Promise((resolve, reject) => {
        if (!(0, _helpers.isNightwatchApi)(api, 'screenshot')) {
            reject(new Error('You must provide the Nightwatch.js API as the first parameter'));
        }

        if (typeof selector !== 'string') {
            reject(new Error('The provided selector must be a string'));
        }

        if (typeof filenames !== 'object') {
            reject(new Error('The provided filepaths must be an object'));
        }

        api.screenshot(selector, screenshotEncoded => {
            const jimpOperations = [_jimp2.default.read(Buffer.from(screenshotEncoded.value, 'base64'))];
            if (_fsExtra2.default.existsSync(filenames.expected)) {
                jimpOperations.push(_jimp2.default.read(filenames.expected));
            }

            resolve(Promise.all(jimpOperations));
        });
    });
}