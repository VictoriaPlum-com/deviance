import htmlReporter from './reporting/html-reporter';

const defaultSettings = {
    reporting: {
        outputPath: 'tests_output/deviance/report',
    },
    regression: {
        baselinePath: 'tests_output/deviance/regression/baselines',
        currentPath: 'tests_output/deviance/regression/current',
    },
};

function hasValidSettings(settings) {
    let isValid = true;
    Object.values(settings).forEach((value) => {
        Object.values(value).forEach((setting) => {
            if (typeof setting !== 'string') {
                isValid = false;
            }
        });
    });

    return isValid;
}

module.exports = class Deviance {
    constructor(settings) {
        if (!hasValidSettings(settings)) {
            throw new Error('The Deviance settings provided are invalid');
        }

        this.settings = Object.assign({}, defaultSettings, settings);
    }

    reporter(results, done) {
        htmlReporter.write(results, this.deviance.reporting);

        done();
    }
};
