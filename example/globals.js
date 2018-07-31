const Deviance = require('deviance');

const deviance = new Deviance({
    reporting: {
        outputPath: 'output/deviance/report',
    },
    regression: {
        expectedPath: 'regression/expected',
        actualPath: 'output/deviance/regression/actual',
    },
});

module.exports = {
    deviance: deviance.settings,
    reporter: deviance.reporter,
};
