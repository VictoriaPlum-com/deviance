import fs from 'fs-extra';
import Jimp from 'jimp';
import { EventEmitter } from 'events';
import generatePaths from '../path-generator';
import { buildCaptureAreas, scrollAndPosition, elementAndViewportData, handleElement } from '../helpers';
import processImages from '../regression/processImages';

module.exports = class CaptureElementScreenshot extends EventEmitter {
    command(selector = 'body', filename = selector, callback = () => {}) {
        const cleanSelector = handleElement(selector);
        const cleanFilename = handleElement(filename);

        const { api } = this.client;
        const { regression: settings } = api.globals.deviance;
        const { name: testName, module: testModule } = api.currentTest;
        const filenames = generatePaths(settings, cleanFilename, testName, testModule);
        const { asyncHookTimeout } = this.client.settings.globals;
        this.client.settings.globals.asyncHookTimeout = settings.screenshotTimeout;

        let elementData;
        let ratio;
        let captureAreas;
        let mainImage;
        let position;

        api
            .execute(elementAndViewportData, [cleanSelector], ({ value }) => {
                elementData = value.element;
                ratio = 1 / value.devicePixelRatio;
                captureAreas = buildCaptureAreas(value.element, value.viewport);
                const width = value.body.width / ratio;
                const height = value.body.height / ratio;
                mainImage = new Jimp(width, height);
            })
            .perform((done) => {
                const lastIndex = captureAreas.length - 1;
                captureAreas.forEach((scrollToOptions, index) => {
                    const options = [JSON.stringify(scrollToOptions)];
                    api.execute(scrollAndPosition, options, ({ value }) => {
                        position = {
                            left: value.left / ratio,
                            top: value.top / ratio,
                        };
                    }).screenshot(false, ({ value }) => {
                        const bufferedScreenshot = Buffer.from(value, 'base64');
                        Jimp.read(bufferedScreenshot).then((image) => {
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
            })
            .perform((done) => {
                const operations = [];
                if (fs.existsSync(filenames.expected)) {
                    operations.push(Jimp.read(filenames.expected));
                }

                Promise
                    .all(operations)
                    .then(([expected]) => {
                        elementData.actual = mainImage;
                        elementData.expected = expected;
                        const result = processImages(elementData, filenames, settings);

                        if (typeof callback === 'function') {
                            callback(result);
                        }

                        this.emit('success');
                        this.emit('complete');
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                        throw err;
                    });
            });

        return this;
    }
};
