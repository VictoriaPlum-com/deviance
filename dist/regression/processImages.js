'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = processImages;

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _jimp = require('jimp');

var _jimp2 = _interopRequireDefault(_jimp);

var _helpers = require('../helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function processImages(data, filenames, settings) {
    const {
        x, y, width, height, actual, expected
    } = data;
    const results = {};

    if (!(0, _helpers.hasProperty)(settings, 'hasDevianceCaptured')) {
        settings.hasDevianceCaptured = true;
        _fsExtra2.default.emptyDirSync(settings.actualPath);
    }

    actual.crop(x, y, width, height).quality(100).write(filenames.actual);
    results.actual = {
        path: filenames.actual,
        width,
        height
    };

    if (expected) {
        results.expected = {
            path: filenames.expected,
            width: expected.bitmap.width,
            height: expected.bitmap.height
        };

        const diff = _jimp2.default.diff(actual, expected);
        results.diff = {
            path: filenames.diff,
            percent: diff.percent
        };
        diff.image.quality(100).write(filenames.diff);
    }

    return results;
}