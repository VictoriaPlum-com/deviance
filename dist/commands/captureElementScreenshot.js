'use strict';

var _events = require('events');

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _jimp = require('jimp');

var _jimp2 = _interopRequireDefault(_jimp);

var _pathGenerator = require('../path-generator');

var _pathGenerator2 = _interopRequireDefault(_pathGenerator);

var _helpers = require('../helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = class CaptureElementScreenshot extends _events.EventEmitter {
    command(selector = 'body', filename = selector, callback = () => {}) {
        const { api } = this.client;
        const { regression: settings } = api.globals.deviance;
        const { name: testName, module: testModule } = api.currentTest;
        const filenames = (0, _pathGenerator2.default)(settings, filename, testName, testModule);

        api.execute(function inBrowser() {
            return window.devicePixelRatio;
        }, [], ratio => {
            const devicePixelRatio = ratio.value;
            api.getLocation(selector, ({ value: { x: xCoord, y: yCoord } }) => {
                const x = Math.round(xCoord * devicePixelRatio);
                const y = Math.round(yCoord * devicePixelRatio);
                api.getElementSize(selector, ({ value: { width: w, height: h } }) => {
                    const width = Math.round(w * devicePixelRatio);
                    const height = Math.round(h * devicePixelRatio);
                    api.screenshot(false, screenshotEncoded => {
                        const results = {};
                        const jimpOperations = [_jimp2.default.read(Buffer.from(screenshotEncoded.value, 'base64'))];
                        if (_fsExtra2.default.existsSync(filenames.expected)) {
                            jimpOperations.push(_jimp2.default.read(filenames.expected));
                        }

                        Promise.all(jimpOperations).then(([actual, expected]) => {
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

                            callback(results);
                            this.emit('complete', results);
                        }).catch(err => {
                            this.emit('error', err);
                        });
                    });
                });
            });
        });

        return this;
    }
};