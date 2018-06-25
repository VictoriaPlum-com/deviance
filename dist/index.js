"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
class Deviance {
    static reporter(results, done) {
        console.log(results);
        done();
    }
}
exports.default = Deviance;