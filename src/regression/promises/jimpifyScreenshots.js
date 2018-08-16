import Jimp from 'jimp';
import fs from 'fs-extra';
import { isNightwatchApi } from '../../helpers';

export default function jimpifyScreenshots(api, selector, filenames) {
    return new Promise((resolve, reject) => {
        if (!isNightwatchApi(api, 'screenshot')) {
            reject(new Error('You must provide the Nightwatch.js API as the first parameter'));
        }

        if (typeof selector !== 'string') {
            reject(new Error('The provided selector must be a string'));
        }

        if (typeof filenames !== 'object') {
            reject(new Error('The provided filepaths must be an object'));
        }

        api.screenshot(selector, (screenshotEncoded) => {
            const jimpOperations = [Jimp.read(Buffer.from(screenshotEncoded.value, 'base64'))];
            if (fs.existsSync(filenames.expected)) {
                jimpOperations.push(Jimp.read(filenames.expected));
            }

            resolve(Promise.all(jimpOperations));
        });
    });
}
