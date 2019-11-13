const Deviance = require('deviance');

const deviance = new Deviance({
    reporting: {
        enabled: true,
    },
    regression: {
        expectedPath: 'regression/expected',
        actualPath: 'output/deviance/regression/actual',
        threshold: 0.1,
    },
});

module.exports = {
    beforeEach(browser, done) {
        browser.resizeWindow(500, 300, done);
    },
    deviance: deviance.settings,
    reporter: deviance.reporter,
};
