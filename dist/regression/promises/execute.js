'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = execute;

var _helpers = require('../../helpers');

function execute(api) {
    return new Promise((resolve, reject) => {
        if (!(0, _helpers.isNightwatchApi)(api, 'execute')) {
            reject(new Error('You must provide the Nightwatch.js API as the first parameter'));
        }

        api.execute(function inBrowser() {
            // eslint-disable-line
            return window.devicePixelRatio; // eslint-disable-line
        }, [], ratio => {
            resolve(ratio.value);
        });
    });
}