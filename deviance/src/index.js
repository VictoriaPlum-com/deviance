import htmlReporter from './reporting/html-reporter';

module.exports = class Deviance {
    static reporter(results, done) {
        htmlReporter.write(results);

        done();
    }
};
