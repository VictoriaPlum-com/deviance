import { hasProperty, getEnvironment } from '../src/helpers';

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

    it('returns true if object has property', () => {
        expect(hasProperty(mockObject, 'prop1')).toBe(true);
    });

    it('returns false if object does not have property', () => {
        expect(hasProperty(mockObject, 'prop3')).toBe(false);
    });
});
