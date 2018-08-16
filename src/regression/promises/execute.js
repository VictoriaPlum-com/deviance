import { isNightwatchApi } from '../../helpers';

export default function execute(api) {
    return new Promise((resolve, reject) => {
        if (!isNightwatchApi(api, 'execute')) {
            reject(new Error('You must provide the Nightwatch.js API as the first parameter'));
        }

        api.execute(function inBrowser() { // eslint-disable-line
            return window.devicePixelRatio; // eslint-disable-line
        }, [], (ratio) => {
            resolve(ratio.value);
        });
    });
}
