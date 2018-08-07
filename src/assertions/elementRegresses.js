import { hasProperty } from '../helpers';

exports.assertion = class ElementRegresses {
    constructor(selector, settings = {}, filename = selector) {
        this.selector = selector;
        this.filename = filename;
        this.message = `Deviance regression (pass): <${selector}> comparison passed`;
        this.expected = settings.threshold || this.api.globals.deviance.regression.threshold;
        this.value = (result) => {
            result.toString = () => result.message;
            return result;
        };
    }

    pass(data) {
        if (!hasProperty(data, 'expected')) {
            this.message = `Deviance regression (new): <${this.selector}> recognised as new regression element`;
            return true;
        }

        const { expected, actual, diff } = data;
        if (expected.width !== actual.width || expected.height !== actual.height) {
            data.message = `${actual.width}x${actual.height}`;
            this.expected = `${expected.width}x${expected.height}`;
            this.message = `Deviance regression (fail): <${this.selector}> has changed dimensions`;
            return false;
        }

        const meetsCriteria = diff.percent < this.expected;
        if (!meetsCriteria) {
            this.message = `Deviance regression (fail): <${this.selector}> comparison failed`;
            this.expected = `less than ${this.expected}`;
            data.message = `${diff.percent}`;
        }

        return meetsCriteria;
    }

    command(callback) {
        this.api.captureElementScreenshot(this.selector, this.filename, callback);
    }
};
