'use strict';

var _events = require('events');

module.exports = class ResizeBrowserToBodyHeight extends _events.EventEmitter {
    command(resizeAdjustment = this.client.api.globals.deviance.regression.resizeAdjustment) {
        const { api } = this.client;
        api.execute(() => ({
            width: document.body.scrollWidth, // eslint-disable-line
            height: document.body.scrollHeight + resizeAdjustment // eslint-disable-line
        }), [resizeAdjustment], result => {
            const { width, height } = result.value;
            api.resizeWindow(width, height, () => {
                this.emit('complete');
            });
        });

        return this;
    }
};