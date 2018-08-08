import { EventEmitter } from 'events';
import fs from 'fs-extra';
import Jimp from 'jimp';
import generatePaths from '../path-generator';
import hasProperty from '../helpers';

module.exports = class CaptureElementScreenshot extends EventEmitter {
    command(selector = 'body', filename = selector, callback = () => {}) {
        const { api } = this.client;
        const { regression: settings } = api.globals.deviance;
        const { name: testName, module: testModule } = api.currentTest;
        const filenames = generatePaths(settings, filename, testName, testModule);

        api.execute(function inBrowser() { // eslint-disable-line
            return window.devicePixelRatio; // eslint-disable-line
        }, [], (ratio) => {
            const devicePixelRatio = ratio.value;
            api.getLocation(selector, ({ value: { x: xCoord, y: yCoord } }) => {
                const x = Math.round(xCoord * devicePixelRatio);
                const y = Math.round(yCoord * devicePixelRatio);
                api.getElementSize(selector, ({ value: { width: w, height: h } }) => {
                    const width = Math.round(w * devicePixelRatio);
                    const height = Math.round(h * devicePixelRatio);
                    api.screenshot(false, (screenshotEncoded) => {
                        const results = {};
                        const jimpOperations = [Jimp.read(Buffer.from(screenshotEncoded.value, 'base64'))];
                        if (fs.existsSync(filenames.expected)) {
                            jimpOperations.push(Jimp.read(filenames.expected));
                        }

                        Promise.all(jimpOperations)
                            .then(([actual, expected]) => {
                                if (!hasProperty(settings, 'hasDevianceCaptured')) {
                                    settings.hasDevianceCaptured = true;
                                    fs.emptyDirSync(settings.actualPath);
                                }

                                actual.crop(x, y, width, height)
                                    .quality(100)
                                    .write(filenames.actual);
                                results.actual = {
                                    path: filenames.actual,
                                    width,
                                    height,
                                };

                                if (expected) {
                                    results.expected = {
                                        path: filenames.expected,
                                        width: expected.bitmap.width,
                                        height: expected.bitmap.height,
                                    };

                                    const diff = Jimp.diff(actual, expected);
                                    results.diff = {
                                        path: filenames.diff,
                                        percent: diff.percent,
                                    };
                                    diff
                                        .image
                                        .quality(100)
                                        .write(filenames.diff);
                                }

                                if (typeof callback === 'function') {
                                    callback(results);
                                }

                                this.emit('complete', results);
                            })
                            .catch((err) => {
                                this.emit('error', err);
                            });
                    });
                });
            });
        });

        return this;
    }
};
