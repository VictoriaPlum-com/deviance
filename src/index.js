export default class Deviance {
    constructor() {
        this.constructed = 1;
        console.log('constructed');
    }

    static reporter(...args) {
        console.log(args);
    }
}
