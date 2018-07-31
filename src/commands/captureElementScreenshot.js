import generatePath from '../path-generator';
import { hasProperty } from '../helpers';

const { EventEmitter } = require('events');
const Jimp = require('jimp');
const fs = require('fs-extra');
const path = require('path');

module.exports = class CaptureElementScreenshot extends EventEmitter {
    command(selector = 'body', filename = selector) {
        const { api } = this.client;
        const { regression: settings } = api.globals.deviance;

        process.nextTick(() => {
            api.getLocation(selector, ({ value: { x, y } }) => {
                api.getElementSize(selector, ({ value: { width, height } }) => {
                    api.screenshot(false, (screenshotEncoded) => {
                        Jimp.read(Buffer.from(screenshotEncoded.value, 'base64'))
                            .then((image) => {
                                const targetFilename = generatePath(settings, filename);

                                if (!hasProperty(settings, 'hasDevianceCaptured')) {
                                    settings.hasDevianceCaptured = true;
                                    fs.emptyDirSync(path.dirname(targetFilename));
                                }

                                image.crop(x, y, width, height)
                                    .quality(100)
                                    .write(targetFilename);

                                this.emit('complete', targetFilename);
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
