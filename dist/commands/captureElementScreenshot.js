'use strict';

var _events = require('events');

var _pathGenerator = require('../path-generator');

var _pathGenerator2 = _interopRequireDefault(_pathGenerator);

var _execute = require('../regression/promises/execute');

var _execute2 = _interopRequireDefault(_execute);

var _locationInView = require('../regression/promises/locationInView');

var _locationInView2 = _interopRequireDefault(_locationInView);

var _elementSize = require('../regression/promises/elementSize');

var _elementSize2 = _interopRequireDefault(_elementSize);

var _jimpifyScreenshots = require('../regression/promises/jimpifyScreenshots');

var _jimpifyScreenshots2 = _interopRequireDefault(_jimpifyScreenshots);

var _processImages = require('../regression/processImages');

var _processImages2 = _interopRequireDefault(_processImages);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = class CaptureElementScreenshot extends _events.EventEmitter {
    command(selector = 'body', filename = selector, callback = () => {}) {
        const { api } = this.client;
        const { regression: settings } = api.globals.deviance;
        const { name: testName, module: testModule } = api.currentTest;
        const filenames = (0, _pathGenerator2.default)(settings, filename, testName, testModule);
        const apiActions = [(0, _execute2.default)(api), (0, _locationInView2.default)(api, selector), (0, _elementSize2.default)(api, selector), (0, _jimpifyScreenshots2.default)(api, selector, filenames)];

        Promise.all(apiActions).then(([devicePixelRatio, location, size, [actual, expected]]) => {
            const x = Math.round(location.x * devicePixelRatio);
            const y = Math.round(location.y * devicePixelRatio);
            const width = Math.round(size.width * devicePixelRatio);
            const height = Math.round(size.height * devicePixelRatio);
            const data = {
                x, y, width, height, actual, expected
            };
            const results = (0, _processImages2.default)(data, filenames, settings);

            if (typeof callback === 'function') {
                callback(results);
            }

            this.emit('complete');
        }).catch(err => {
            this.emit('error');
            throw new Error(err);
        });

        return this;
    }
};