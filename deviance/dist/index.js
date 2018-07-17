"use strict";

module.exports = class Deviance {
    static reporter(results, done) {
        console.log(results);
        done();
    }
};