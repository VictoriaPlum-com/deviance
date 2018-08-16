'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = elementSize;

var _helpers = require('../../helpers');

function elementSize(api, selector) {
    return new Promise((resolve, reject) => {
        if (!(0, _helpers.isNightwatchApi)(api, 'getElementSize')) {
            reject(new Error('You must provide the Nightwatch.js API as the first parameter'));
        }

        if (typeof selector !== 'string') {
            reject(new Error('The selector parameter much be provided'));
        }

        api.getElementSize(selector, ({ value }) => {
            resolve(value);
        });
    });
}