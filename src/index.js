import htmlReporter from './reporting/html-reporter';

const defaultSettings = {
    reporting: {
        outputPath: 'tests_output/deviance/report',
    },
    regression: {
        expectedPath: 'tests_output/deviance/regression/expected',
        actualPath: 'tests_output/deviance/regression/actual',
        threshold: 0.1,
    },
};

module.exports = class Deviance {
    constructor(settings) {
        this.settings = {};
        Object.entries(defaultSettings).forEach(([k, v]) => {
            this.settings[k] = Object.assign({}, v, settings[k]);
        });
    }

    reporter(results, done) {
        htmlReporter.write(results, this.deviance.reporting);

        done();
    }
};
