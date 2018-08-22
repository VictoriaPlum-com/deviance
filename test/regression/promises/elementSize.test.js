import elementSize from '../../../src/regression/promises/elementSize';

const mockElementSize = jest.fn((selector, cb) => cb({ value: 'some value' }));
const mockApi = {
    getElementSize: mockElementSize,
};

describe('Given elementSize()', () => {
    describe('When it is called with valid parameter', () => {
        const instance = elementSize(mockApi, 'selector');

        it('Then it resolves a promise with expected value', () => {
            expect.assertions(1);
            return expect(instance).resolves.toBe('some value');
        });

        it('Then getElementSize is called', () => {
            expect(mockElementSize).toHaveBeenCalled();
        });
    });

    describe('When it is called without a selector', () => {
        const instance = elementSize(mockApi);

        it('Then it rejects a promise with the appropriate message', () => {
            expect.assertions(1);
            return expect(instance).rejects.toThrow('The selector parameter much be provided');
        });
    });

    describe('When it is called with an invalid api parameter', () => {
        const instance = elementSize({});

        it('Then it rejects a promise with the appropriate message', () => {
            expect.assertions(1);
            return expect(instance).rejects.toThrow('You must provide the Nightwatch.js API as the first parameter');
        });
    });
});
