const Deviance = require('deviance');

const deviance = new Deviance({
    reporting: {
        outputPath: 'output/deviance/report',
    },
    regression: {
        expectedPath: 'regression/expected',
        actualPath: 'output/deviance/regression/actual',
        threshold: 0.001,
    },
});

module.exports = {
    deviance: deviance.settings,
    reporter: deviance.reporter,
};
