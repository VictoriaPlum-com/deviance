'use strict';

var _pathGenerator = require('../path-generator');

var _pathGenerator2 = _interopRequireDefault(_pathGenerator);

var _helpers = require('../helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { EventEmitter } = require('events');
const Jimp = require('jimp');
const fs = require('fs-extra');

module.exports = class CaptureElementScreenshot extends EventEmitter {
    command(selector = 'body', filename = selector, callback = () => {}) {
        const { api } = this.client;
        const { regression: settings } = api.globals.deviance;
        const { name: testName, module: testModule } = api.currentTest;
        const filenames = (0, _pathGenerator2.default)(settings, filename, testName, testModule);

        api.getLocation(selector, ({ value: { x, y } }) => {
            api.getElementSize(selector, ({ value: { width, height } }) => {
                api.screenshot(false, screenshotEncoded => {
                    const results = {};
                    const jimpOperations = [Jimp.read(Buffer.from(screenshotEncoded.value, 'base64'))];
                    if (fs.existsSync(filenames.expected)) {
                        jimpOperations.push(Jimp.read(filenames.expected));
                    }

                    Promise.all(jimpOperations).then(([actual, expected]) => {
                        if (!(0, _helpers.hasProperty)(settings, 'hasDevianceCaptured')) {
                            settings.hasDevianceCaptured = true;
                            fs.emptyDirSync(settings.actualPath);
                        }

                        actual.crop(x, y, width, height).quality(100).write(filenames.actual);
                        results.actual = {
                            path: filenames.actual,
                            width: Math.round(width),
                            height: Math.round(height)
                        };

                        if (expected) {
                            results.expected = {
                                path: filenames.expected,
                                width: expected.bitmap.width,
                                height: expected.bitmap.height
                            };

                            const diff = Jimp.diff(actual, expected);
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

        return this;
    }
};