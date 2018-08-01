import generatePaths from '../path-generator';
import { hasProperty } from '../helpers';

const { EventEmitter } = require('events');
const Jimp = require('jimp');
const fs = require('fs-extra');

module.exports = class CaptureElementScreenshot extends EventEmitter {
    command(selector = 'body', filename = selector, callback = () => {}) {
        const { api } = this.client;
        const { regression: settings } = api.globals.deviance;
        const { name: testName, module: testModule } = api.currentTest;
        const filenames = generatePaths(settings, filename, testName, testModule);

        api.getLocation(selector, ({ value: { x, y } }) => {
            api.getElementSize(selector, ({ value: { width, height } }) => {
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

                            const pixelsWide = [...Array(width).keys()];
                            const pixelsHigh = [...Array(height).keys()];
                            const distribution = {};
                            const total = width * height;

                            pixelsHigh.forEach((py) => {
                                const pyi = py + y;
                                pixelsWide.forEach((px) => {
                                    const pxi = px + x;
                                    const colour = actual.getPixelColor(pxi, pyi);
                                    if (hasProperty(distribution, colour)) {
                                        distribution[colour] += 1;
                                    } else {
                                        distribution[colour] = 1;
                                    }
                                });
                            });

                            const mostFrequent = Math.max(...Object.values(distribution));
                            actual.crop(x, y, width, height)
                                .quality(100)
                                .write(filenames.actual);
                            results.actual = {
                                path: filenames.actual,
                                width,
                                height,
                            };

                            if ((mostFrequent / total) > 0.8) {
                                results.actual.criticalThreshold = true;
                            }

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

                            callback(results);
                            this.emit('complete', results);
                        })
                        .catch((err) => {
                            this.emit('error', err);
                        });
                });
            });
        });

        return this;
    }
};
