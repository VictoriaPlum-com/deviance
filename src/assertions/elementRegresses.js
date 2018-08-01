import { hasProperty } from '../helpers';

exports.assertion = function elementRegression(selector, settings = {}, filename = selector) {
    this.message = `Deviance regression (pass): <${selector}> comparison passed`;

    this.expected = settings.threshold || this.api.globals.deviance.regression.threshold;

    this.pass = (data) => {
        if (!hasProperty(data, 'expected')) {
            this.message = `Deviance regression (new): <${selector}> recognised as new regression element`;
            return true;
        }

        const { expected, actual, diff } = data;
        if (expected.width !== actual.width || expected.height !== actual.height) {
            data.message = `${actual.width}x${actual.height}`;
            this.expected = `${expected.width}x${expected.height}`;
            this.message = `Deviance regression (fail): <${selector}> has changed dimensions`;
            return false;
        }

        if (hasProperty(actual, 'criticalThreshold')) {
            this.expected = 0.0005;
        }

        const meetsCriteria = diff.percent < this.expected;
        if (!meetsCriteria) {
            this.message = `Deviance regression (fail): <${selector}> comparison failed`;
            this.expected = `less than ${this.expected}`;
            data.message = `${diff.percent}`;
        }

        return meetsCriteria;
    };

    this.value = (result) => {
        result.toString = () => result.message;
        return result;
    };

    this.command = callback => this.api.captureElementScreenshot(selector, filename, callback);
};
