const Deviance = require('deviance');

const deviance = new Deviance({
    reporting: {
        enabled: true,
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
