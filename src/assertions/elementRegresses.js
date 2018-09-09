import { handleElement, hasProperty, hasValidThreshold } from '../helpers';

exports.assertion = class ElementRegresses {
    constructor(selector = 'body', filename = selector, threshold = null) {
        const { threshold: globalThreshold } = this.api.globals.deviance.regression;
        this.selector = handleElement(selector);
        this.filename = handleElement(filename);
        this.message = `Deviance regression (pass): <${this.selector}> {${this.filename}} comparison passed`;
        this.expected = threshold === null ? globalThreshold : threshold;
        this.value = (result) => {
            result.toString = () => result.message;
            return result;
        };
    }

    pass(data) {
        if (!hasProperty(data, 'expected')) {
            this.message = `Deviance regression (new): <${this.selector}> {${this.filename}} recognised as new regression element`;
            return true;
        }

        const { expected, actual, diff } = data;
        if (expected.width !== actual.width || expected.height !== actual.height) {
            data.message = `${actual.width}x${actual.height}`;
            this.expected = `${expected.width}x${expected.height}`;
            this.message = `Deviance regression (fail): <${this.selector}> {${this.filename}} has changed dimensions`;
            return false;
        }

        if (!hasValidThreshold(this.expected)) {
            this.message = 'Deviance regression (fail): The supplied threshold parameter is not between 0 and 1';
            data.message = `${typeof this.expected} ${this.expected}`;
            this.expected = 'Requires number between 0 and 1';
            return false;
        }

        const meetsCriteria = diff.percent <= this.expected;
        if (!meetsCriteria) {
            this.message = `Deviance regression (fail): <${this.selector}> {${this.filename}} comparison failed`;
            this.expected = `less than or equal to ${this.expected}`;
            data.message = `${diff.percent}`;
        }

        return meetsCriteria;
    }

    command(callback) {
        this.api.captureElementScreenshot(this.selector, this.filename, callback);
    }
};
