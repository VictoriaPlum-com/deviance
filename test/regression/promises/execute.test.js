import execute from '../../../src/regression/promises/execute';

const mockExecute = jest.fn((browserCb, data, cb) => cb({ value: 2 }));
const mockApi = {
    execute: mockExecute,
};

describe('Given execute()', () => {
    describe('When it is called with valid parameter', () => {
        const instance = execute(mockApi);

        it('Then it resolves a promise with expected value', () => {
            expect.assertions(1);
            return expect(instance).resolves.toBe(2);
        });

        it('Then execute() is called', () => {
            expect(mockExecute).toHaveBeenCalled();
        });
    });

    describe('When it is called with an invalid api parameter', () => {
        const instance = execute({});

        it('Then it rejects a promise with the appropriate message', () => {
            expect.assertions(1);
            return expect(instance).rejects.toThrow('You must provide the Nightwatch.js API as the first parameter');
        });
    });
});
