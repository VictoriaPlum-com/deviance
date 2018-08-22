import { isNightwatchApi } from '../../helpers';

export default function elementSize(api, selector) {
    return new Promise((resolve, reject) => {
        if (!isNightwatchApi(api, 'getElementSize')) {
            reject(new Error('You must provide the Nightwatch.js API as the first parameter'));
        }

        if (typeof selector !== 'string') {
            reject(new Error('The selector parameter much be provided'));
        }

        api.getElementSize(selector, ({ value }) => {
            resolve(value);
        });
    });
}
