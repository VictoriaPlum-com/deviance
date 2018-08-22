import locationInView from '../../../src/regression/promises/locationInView';

const mockLocationInView = jest.fn((selector, cb) => cb({ value: 'some value' }));
const mockApi = {
    getLocationInView: mockLocationInView,
};

describe('Given locationInView()', () => {
    describe('When it is called with valid parameter', () => {
        const instance = locationInView(mockApi, 'selector');

        it('Then it resolves a promise with expected value', () => {
            expect.assertions(1);
            return expect(instance).resolves.toBe('some value');
        });

        it('Then getLocationInView is called', () => {
            expect(mockLocationInView).toHaveBeenCalled();
        });
    });

    describe('When it is called without a selector', () => {
        const instance = locationInView(mockApi);

        it('Then it rejects a promise with the appropriate message', () => {
            expect.assertions(1);
            return expect(instance).rejects.toThrow('The selector parameter much be provided');
        });
    });

    describe('When it is called with an invalid api parameter', () => {
        const instance = locationInView({});

        it('Then it rejects a promise with the appropriate message', () => {
            expect.assertions(1);
            return expect(instance).rejects.toThrow('You must provide the Nightwatch.js API as the first parameter');
        });
    });
});
