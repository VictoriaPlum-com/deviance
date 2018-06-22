'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
class Deviance {
    constructor() {
        this.constructed = 1;
        console.log('constructed');
    }

    static reporter(...args) {
        console.log(args);
    }
}
exports.default = Deviance;