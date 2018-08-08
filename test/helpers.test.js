import hasProperty from '../src/helpers';

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
