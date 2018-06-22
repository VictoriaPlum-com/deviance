const Deviance = require('./../dist');

module.exports = {
    reporter: function reporter(results, done) {
        console.log(results);
        done();
    },
};
