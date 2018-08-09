import Deviance, { getEnvIndex, getEnvironment } from '../src/index';

describe('Given getEnvIndex', () => {
    describe('When no envFlag passed', () => {
        const args = [];
        it('Then returns result of 0', () => {
            expect(getEnvIndex(args)).toBe(0);
        });
    });

    describe('When envFlag passed as first set of arguments', () => {
        const args = ['-mock', 'mocked', '-e', 'value'];
        it('Then returns index of "value"', () => {
            expect(getEnvIndex(args)).toBe(3);
        });
    });
});

describe('Given getEnvironment', () => {
    describe('When no envFlag passed', () => {
        const args = [];
        it('Then returns value of default', () => {
            expect(getEnvironment(args)).toBe('default');
        });
    });

    describe('When envFlag passed', () => {
        const args = ['-e', 'value'];
        it('Then returns value of passed string', () => {
            expect(getEnvironment(args)).toBe('value');
        });
    });
});

describe('Given Deviance class', () => {
    describe('When not passing in any custom settings', () => {
        const instance = new Deviance();
        it('Then the default paths should be used', () => {
            expect(instance.settings.regression.expectedPath).toBeDefined();
        });
        it('Then default reporter enabled setting is false', () => {
            expect(instance.settings.reporting.enabled).toBe(false);
        })
    });

    describe('When passing custom path settings', () => {
        const settings = {
            regression: {
                expectedPath: 'regression/mock',
            },
        };
        const instance = new Deviance(settings);
        it('Then custom settings overwrite default settings', () => {
            expect(instance.settings.regression.expectedPath).toContain(settings.regression.expectedPath);
        });
    });

    describe('When passing custom reporter settings', () => {
        const settings = {
            reporting: {
                enabled: true,
            },
        };
        const instance = new Deviance(settings);
        it('Then custom settings overwrite default settings', () => {
            expect(instance.settings.reporting.enabled).toBe(true);
        });
    });

    describe('When passing in invalid param', () => {
        const instance = new Deviance('blah');
        it('Then the default settings should be used', () => {
            expect(instance.settings.regression.expectedPath).toBeDefined();
        });
    });

    describe('When env const equals a value', () => {
        const instance = new Deviance({}, ['-e', 'mockValue']);
        it('Then regression expectedPath is contains envFlag', () => {
            expect(instance.settings.regression.expectedPath).toContain('mockValue');
        });

        it('Then regression actualPath is contains envFlag', () => {
            expect(instance.settings.regression.actualPath).toContain('mockValue');
        });
    });
});
