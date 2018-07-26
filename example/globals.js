const Deviance = require('deviance');

const deviance = new Deviance({
    reporting: {
        outputPath: 'output/deviance/report',
    },
    regression: {
        baselinePath: 'output/deviance/regression/baseline',
        currentPath: 'output/deviance/regression/current',
    },
});

module.exports = {
    deviance: deviance.settings,
    reporter: deviance.reporter,
};
