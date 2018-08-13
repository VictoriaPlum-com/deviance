import ElementRegresses from '../../src/assertions/elementRegresses';

describe('Given ElementRegresses', () => {
    let instance;
    describe('When no selector passed', () => {
        beforeAll(() => {
            // eslint-disable-next-line new-cap
            instance = new ElementRegresses.assertion(undefined, undefined, 0.1);
        });
        it('Then selector uses default value', () => {
            expect(instance.selector).toBe('body');
        });
        it('Then filename uses default value', () => {
            expect(instance.filename).toBe('body');
        });
        it('Then message is as expected', () => {
            expect(instance.message).toContain('Deviance regression (pass): <body> comparison passed');
        });
    });

    describe('When setting threshold below the required range', () => {
        beforeAll(() => {
            // eslint-disable-next-line new-cap
            instance = new ElementRegresses.assertion(undefined, undefined, -1);
        });
        it('Then the threshold should be set to the min value', () => {
            expect(instance.expected).toBe(0);
        });
    });

    describe('When setting threshold above the required range', () => {
        beforeAll(() => {
            // eslint-disable-next-line new-cap
            instance = new ElementRegresses.assertion(undefined, undefined, 10);
        });
        it('Then the threshold should be set to the min value', () => {
            expect(instance.expected).toBe(1);
        });
    });
});

describe('Given ElementRegression.pass', () => {
    let instance;
    let result;
    describe('When checking with new element', () => {
        beforeAll(() => {
            // eslint-disable-next-line new-cap
            instance = new ElementRegresses.assertion(undefined, undefined, 0.1);
            const data = {
                actual: {
                    path: 'output/deviance/regression/actual/default/groupA/basicTest/Squirrel-test/img.png',
                    width: 1280,
                    height: 960,
                },
            };
            result = instance.pass(data);
        });
        it('Then message is set to "new element" text', () => {
            expect(instance.message).toBe('Deviance regression (new): <body> recognised as new regression element');
        });
        it('Then should pass', () => {
            expect(result).toBe(true);
        });
    });

    describe('When checking element with different dimensions', () => {
        beforeAll(() => {
            // eslint-disable-next-line new-cap
            instance = new ElementRegresses.assertion(undefined, undefined, 0.1);
            const data = {
                actual: {
                    path: 'output/deviance/regression/actual/default/groupA/basicTest/Squirrel-test/img.png',
                    width: 100,
                    height: 100,
                },
                expected: {
                    path: 'regression/expected/default/groupA/basicTest/Squirrel-test/img.png',
                    width: 1280,
                    height: 960,
                },
            };
            result = instance.pass(data);
        });
        it('Then message is set to "changed dimensions" text', () => {
            expect(instance.message).toBe('Deviance regression (fail): <body> has changed dimensions');
        });
        it('Then should fail', () => {
            expect(result).toBe(false);
        });
    });

    describe('When checking with an invalid threshold that is not a number', () => {
        beforeAll(() => {
            // eslint-disable-next-line new-cap
            instance = new ElementRegresses.assertion(undefined, undefined, 'bob');
            const data = {
                actual: {
                    path: 'output/deviance/regression/actual/default/groupA/basicTest/Squirrel-test/img.png',
                    width: 1280,
                    height: 960,
                },
                expected: {
                    path: 'regression/expected/default/groupA/basicTest/Squirrel-test/img.png',
                    width: 1280,
                    height: 960,
                },
                diff: {
                    path: 'output/deviance/regression/actual/default/groupA/basicTest/Squirrel-test/diff/img.png',
                    percent: 0,
                },
            };
            result = instance.pass(data);
        });
        it('Then message is set to "threshold is not a number" text', () => {
            expect(instance.message).toBe('Deviance regression (fail): The supplied threshold parameter is not a number');
        });
        it('Then should fail', () => {
            expect(result).toBe(false);
        });
    });

    describe('When checking element that fails comparison', () => {
        beforeAll(() => {
            // eslint-disable-next-line new-cap
            instance = new ElementRegresses.assertion(undefined, undefined, 0.1);
            const data = {
                actual: {
                    path: 'output/deviance/regression/actual/default/groupA/basicTest/Squirrel-test/img.png',
                    width: 1280,
                    height: 960,
                },
                expected: {
                    path: 'regression/expected/default/groupA/basicTest/Squirrel-test/img.png',
                    width: 1280,
                    height: 960,
                },
                diff: {
                    path: 'output/deviance/regression/actual/default/groupA/basicTest/Squirrel-test/diff/img.png',
                    percent: 10,
                },
            };
            result = instance.pass(data);
        });
        it('Then message is set to "comparison failed" text', () => {
            expect(instance.message).toBe('Deviance regression (fail): <body> comparison failed');
        });
        it('Then should fail', () => {
            expect(result).toBe(false);
        });
    });

    describe('When checking element that passes comparison', () => {
        beforeAll(() => {
            // eslint-disable-next-line new-cap
            instance = new ElementRegresses.assertion(undefined, undefined, 0.1);
            const data = {
                actual: {
                    path: 'output/deviance/regression/actual/default/groupA/basicTest/Squirrel-test/img.png',
                    width: 1280,
                    height: 960,
                },
                expected: {
                    path: 'regression/expected/default/groupA/basicTest/Squirrel-test/img.png',
                    width: 1280,
                    height: 960,
                },
                diff: {
                    path: 'output/deviance/regression/actual/default/groupA/basicTest/Squirrel-test/diff/img.png',
                    percent: 0,
                },
            };
            result = instance.pass(data);
        });
        it('Then should pass', () => {
            expect(result).toBe(true);
        });
    });
});
