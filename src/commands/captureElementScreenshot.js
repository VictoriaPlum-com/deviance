import { EventEmitter } from 'events';
import generatePaths from '../path-generator';
import execute from '../regression/promises/execute';
import locationInView from '../regression/promises/locationInView';
import elementSize from '../regression/promises/elementSize';
import jimpifyScreenshots from '../regression/promises/jimpifyScreenshots';
import processImages from '../regression/processImages';

module.exports = class CaptureElementScreenshot extends EventEmitter {
    command(selector = 'body', filename = selector, callback = () => {}) {
        const { api } = this.client;
        const { regression: settings } = api.globals.deviance;
        const { name: testName, module: testModule } = api.currentTest;
        const filenames = generatePaths(settings, filename, testName, testModule);
        const apiActions = [
            execute(api),
            locationInView(api, selector),
            elementSize(api, selector),
            jimpifyScreenshots(api, selector, filenames),
        ];

        Promise
            .all(apiActions)
            .then(([devicePixelRatio, location, size, [actual, expected]]) => {
                const x = Math.round(location.x * devicePixelRatio);
                const y = Math.round(location.y * devicePixelRatio);
                const width = Math.round(size.width * devicePixelRatio);
                const height = Math.round(size.height * devicePixelRatio);
                const data = {
                    x, y, width, height, actual, expected,
                };
                const results = processImages(data, filenames, settings);

                if (typeof callback === 'function') {
                    callback(results);
                }

                this.emit('complete');
            })
            .catch((err) => {
                this.emit('error');
                throw new Error(err);
            });

        return this;
    }
};
