'use strict';

var _reporter = require('./reporting/reporter');

var _reporter2 = _interopRequireDefault(_reporter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const path = require('path');

const defaultSettings = {
    reporting: {
        outputPath: 'tests_output/deviance/report',
        openReport: false
    },
    regression: {
        expectedPath: 'tests_output/deviance/regression/expected',
        actualPath: 'tests_output/deviance/regression/actual',
        threshold: 0.1
    }
};

function getEnvironment() {
    const envFlags = ['-e', '--env'];
    const args = process.argv;
    const index = args.findIndex(arg => envFlags.includes(arg)) + 1;

    return index > 0 && index < args.length ? process.argv[index] : 'default';
}

module.exports = class Deviance {
    constructor(settings) {
        this.settings = {};
        Object.entries(defaultSettings).forEach(([k, v]) => {
            this.settings[k] = Object.assign({}, v, settings[k]);
        });

        const env = getEnvironment();
        const { expectedPath, actualPath } = this.settings.regression;
        this.settings.regression.expectedPath = path.join(expectedPath, env);
        this.settings.regression.actualPath = path.join(actualPath, env);
    }

    reporter(results, done) {
        _reporter2.default.write(results, this.deviance);

        done();
    }
};