import { hasProperty, getEnvironment, hasValidThreshold } from '../src/helpers';

describe('Given getEnvironment', () => {
    describe('When no envFlag passed', () => {
        it('Then returns value of default', () => {
            expect(getEnvironment([])).toBe('default');
        });
    });

    describe('When envFlag passed', () => {
        it('Then returns value of passed string', () => {
            expect(getEnvironment(['-e', 'value'])).toBe('value');
        });
    });
});

describe('Given hasProperty', () => {
    const mockObject = {
        prop1: 'blag',
        prop2: 'blah',
    };

    it('Then it returns true if object has property', () => {
        expect(hasProperty(mockObject, 'prop1')).toBe(true);
    });

    it('Then it returns false if object does not have property', () => {
        expect(hasProperty(mockObject, 'prop3')).toBe(false);
    });
});

describe('Given hasValidThreshold', () => {
    it('Then it returns false if value is over 1', () => {
        expect(hasValidThreshold(100)).toBe(false);
    });

    it('Then it returns false if value is under 0', () => {
        expect(hasValidThreshold(-1)).toBe(false);
    });

    it('Then it returns false if value is not a number', () => {
        expect(hasValidThreshold('number')).toBe(false);
    });

    it('Then it returns true for a valid value', () => {
        expect(hasValidThreshold(0.5)).toBe(true);
    });
});
