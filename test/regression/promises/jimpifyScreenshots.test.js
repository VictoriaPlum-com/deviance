import fs from 'fs-extra';
import Jimp from 'jimp';
import jimpifyScreenshots from '../../../src/regression/promises/jimpifyScreenshots';

jest.mock('fs-extra');
jest.mock('jimp');

let mockScreenshot;
let mockApi;
let instance;

const mockFilepaths = {
    expected: 'expected/path',
    actual: 'actual/path',
    diff: 'diff/path',
};

function setupMocks() {
    mockScreenshot = jest.fn((selector, cb) => cb({
        value: 'some value',
    }));
    mockApi = {
        screenshot: mockScreenshot,
    };
    Jimp.read = jest.fn(() => 'jimp read value');
}


describe('Given Given jimpifyScreenshots ', () => {
    describe('When it is called with valid parameter', () => {
        beforeAll(() => {
            setupMocks();
            instance = jimpifyScreenshots(mockApi, 'selector', mockFilepaths);
        });

        afterAll(() => {
            jest.resetAllMocks();
        });

        it('Then it resolves a promise with the output from Jimp', () => {
            expect.assertions(1);
            return expect(instance).resolves.toEqual(['jimp read value']);
        });

        it('Then screenshot has been called', () => {
            expect(mockScreenshot).toHaveBeenCalled();
        });

        it('Then existsSync has been called', () => {
            expect(fs.existsSync).toHaveBeenCalled();
        });

        it('Then read has been called once', () => {
            expect(Jimp.read).toHaveBeenCalledTimes(1);
        });
    });

    describe('When it is called with existsSync returning true', () => {
        beforeAll(() => {
            fs.existsSync = jest.fn(() => true);
            setupMocks();
            instance = jimpifyScreenshots(mockApi, 'selector', mockFilepaths);
        });

        afterAll(() => {
            jest.resetAllMocks();
        });

        it('Then it resolves a promise with the output from Jimp', () => {
            expect.assertions(1);
            return expect(instance).resolves.toEqual(['jimp read value', 'jimp read value']);
        });

        it('Then read has been called twice', () => {
            expect(Jimp.read).toHaveBeenCalledTimes(2);
        });
    });

    describe('When it is called with an invalid api parameter', () => {
        beforeAll(() => {
            setupMocks();
            instance = jimpifyScreenshots({});
        });

        afterAll(() => {
            jest.resetAllMocks();
        });

        it('Then it rejects a promise with the appropriate message', () => {
            expect.assertions(1);
            return expect(instance).rejects.toThrow('You must provide the Nightwatch.js API as the first parameter');
        });
    });

    describe('When it is called with an invalid selector parameter', () => {
        beforeAll(() => {
            setupMocks();
            instance = jimpifyScreenshots(mockApi, 100);
        });

        afterAll(() => {
            jest.resetAllMocks();
        });

        it('Then it rejects a promise with the appropriate message', () => {
            expect.assertions(1);
            return expect(instance).rejects.toThrow('The provided selector must be a string');
        });
    });

    describe('When it is called with an invalid filepaths parameter', () => {
        beforeAll(() => {
            setupMocks();
            instance = jimpifyScreenshots(mockApi, 'selector', 1);
        });

        afterAll(() => {
            jest.resetAllMocks();
        });

        it('Then it rejects a promise with the appropriate message', () => {
            expect.assertions(1);
            return expect(instance).rejects.toThrow('The provided filepaths must be an object');
        });
    });
});
