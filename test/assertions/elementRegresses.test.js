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

    describe('When checking with an invalid threshold', () => {
        beforeAll(() => {
            // eslint-disable-next-line new-cap
            instance = new ElementRegresses.assertion(undefined, undefined, -10);
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
        it('Then the expected should be "Requires number between 0 and 1"', () => {
            expect(instance.expected).toBe('Requires number between 0 and 1');
        });
        it('Then message is set to "threshold is not within required range" text', () => {
            expect(instance.message).toBe('Deviance regression (fail): The supplied threshold parameter is not between 0 and 1');
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
