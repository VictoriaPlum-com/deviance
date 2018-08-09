import path from 'path';
import reporter from './reporting/reporter';
import hasProperty from './helpers';

const defaultSettings = {
    reporting: {
        enabled: false,
        port: 8083,
    },
    regression: {
        expectedPath: 'tests_output/deviance/regression/expected',
        actualPath: 'tests_output/deviance/regression/actual',
        threshold: 0.05,
    },
};

function getEnvIndex(args) {
    const envFlags = ['-e', '--env'];
    return args.findIndex(arg => envFlags.includes(arg)) + 1;
};

function getEnvironment(args) {
    const index = getEnvIndex(args);

    return (index > 0 && index < args.length) ? args[index] : 'default';
};

module.exports = class Deviance {
    constructor(settings = {}, args = process.argv) {
        this.settings = {};

        if (settings.constructor !== Object) {
            this.settings = defaultSettings;
        } else {
            Object.entries(defaultSettings).forEach(([k, v]) => {
                if (hasProperty(settings, k)) {
                    this.settings[k] = Object.assign({}, v, settings[k]);
                } else {
                    this.settings[k] = Object.assign({}, v);
                }
            });
        }
        
        const env = getEnvironment(args);
        const { expectedPath, actualPath } = this.settings.regression;
        this.settings.regression.expectedPath = path.join(expectedPath, env);
        this.settings.regression.actualPath = path.join(actualPath, env);
    }

    reporter(results, done) {
        reporter.write(results, this.deviance);

        done();
    }
};

module.exports.getEnvIndex = getEnvIndex;
module.exports.getEnvironment = getEnvironment;
