import path from 'path';
import reporter from './reporting/reporter';
import { hasProperty, getEnvironment } from './helpers';

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

module.exports = class Deviance {
    constructor(settings = {}) {
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

        const { threshold } = this.settings.regression;
        if (typeof threshold !== 'number' || threshold < 0 || threshold > 1) {
            throw new Error('Threshold requires value between 0 and 1');
        }

        const env = getEnvironment(process.argv);
        const { expectedPath, actualPath } = this.settings.regression;
        this.settings.regression.expectedPath = path.join(expectedPath, env);
        this.settings.regression.actualPath = path.join(actualPath, env);
    }

    reporter(results, done) {
        reporter.write(results, this.deviance);

        done();
    }
};
