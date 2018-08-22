'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = locationInView;

var _helpers = require('../../helpers');

function locationInView(api, selector) {
    return new Promise((resolve, reject) => {
        if (!(0, _helpers.isNightwatchApi)(api, 'getLocationInView')) {
            reject(new Error('You must provide the Nightwatch.js API as the first parameter'));
        }

        if (typeof selector !== 'string') {
            reject(new Error('The selector parameter much be provided'));
        }

        api.getLocationInView(selector, ({ value }) => {
            resolve(value);
        });
    });
}