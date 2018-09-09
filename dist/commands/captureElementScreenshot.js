'use strict';

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _jimp = require('jimp');

var _jimp2 = _interopRequireDefault(_jimp);

var _events = require('events');

var _pathGenerator = require('../path-generator');

var _pathGenerator2 = _interopRequireDefault(_pathGenerator);

var _helpers = require('../helpers');

var _processImages = require('../regression/processImages');

var _processImages2 = _interopRequireDefault(_processImages);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = class CaptureElementScreenshot extends _events.EventEmitter {
    command(selector = 'body', filename = selector, callback = () => {}) {
        const cleanSelector = (0, _helpers.handleElement)(selector);
        const cleanFilename = (0, _helpers.handleElement)(filename);

        const { api } = this.client;
        const { regression: settings } = api.globals.deviance;
        const { name: testName, module: testModule } = api.currentTest;
        const filenames = (0, _pathGenerator2.default)(settings, cleanFilename, testName, testModule);
        const { asyncHookTimeout } = this.client.settings.globals;
        this.client.settings.globals.asyncHookTimeout = settings.screenshotTimeout;

        let elementData;
        let ratio;
        let captureAreas;
        let mainImage;
        let position;

        api.execute(_helpers.elementAndViewportData, [cleanSelector], ({ value }) => {
            elementData = value.element;
            ratio = 1 / value.devicePixelRatio;
            captureAreas = (0, _helpers.buildCaptureAreas)(value.element, value.viewport);
            const width = value.body.width / ratio;
            const height = value.body.height / ratio;
            mainImage = new _jimp2.default(width, height);
        }).perform(done => {
            const lastIndex = captureAreas.length - 1;
            captureAreas.forEach((scrollToOptions, index) => {
                const options = [JSON.stringify(scrollToOptions)];
                api.execute(_helpers.scrollAndPosition, options, ({ value }) => {
                    position = {
                        left: value.left / ratio,
                        top: value.top / ratio
                    };
                }).screenshot(false, ({ value }) => {
                    const bufferedScreenshot = Buffer.from(value, 'base64');
                    _jimp2.default.read(bufferedScreenshot).then(image => {
                        mainImage.composite(image, position.left, position.top);
                        if (index === lastIndex) {
                            if (ratio !== 1) {
                                mainImage.scale(ratio);
                            }

                            this.client.settings.globals.asyncHookTimeout = asyncHookTimeout;
                            done();
                        }
                    });
                });
            });
        }).perform(done => {
            const operations = [];
            if (_fsExtra2.default.existsSync(filenames.expected)) {
                operations.push(_jimp2.default.read(filenames.expected));
            }

            Promise.all(operations).then(([expected]) => {
                elementData.actual = mainImage;
                elementData.expected = expected;
                const result = (0, _processImages2.default)(elementData, filenames, settings);

                if (typeof callback === 'function') {
                    callback(result);
                }

                this.emit('success');
                this.emit('complete');
                done();
            }).catch(err => {
                console.log(err);
                throw err;
            });
        });

        return this;
    }
};