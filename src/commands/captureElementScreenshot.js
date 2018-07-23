const { EventEmitter } = require('events');

const jimp = require('jimp');

function generateFilename(filename) {
    const prePath = 'output/captures/';
    const prefix = 'compare_';
    const postfix = '.png';

    return prePath + prefix + filename + postfix;
}

module.exports = class CaptureElementScreenshot extends EventEmitter {
    command(selector = 'body', filename = selector) {
        const { api } = this.client;

        process.nextTick(() => {
            api.getLocation(selector, ({ value: { x, y } }) => {
                api.getElementSize(selector, ({ value: { width, height } }) => {
                    api.screenshot(false, (screenshotEncoded) => {
                        jimp.read(Buffer.from(screenshotEncoded.value, 'base64'))
                            .then((image) => {
                                image.crop(x, y, width, height)
                                    .quality(100)
                                    .write(generateFilename(filename));

                                this.emit('complete');
                            })
                            .catch((err) => {
                                this.emit(err);
                            });
                    });
                });
            });
        });

        return this;
    }
};
