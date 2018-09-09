import { EventEmitter } from 'events';
import CaptureElementScreenshot from '../../src/commands/captureElementScreenshot';
import generatePaths from '../../src/path-generator';

jest.mock('../../src/path-generator');
jest.mock('../../src/regression/processImages');

const mockInstance = {
    emit: jest.fn(),
    client: {
        settings: {
            globals: {
                asyncHookTimeout: 1,
            },
        },
        api: {
            execute: jest.fn(() => mockInstance.client.api),
            perform: jest.fn(() => mockInstance.client.api),
            globals: {
                deviance: {
                    regression: {
                        expectedPath: 'expected',
                        actualPath: 'actual',
                    },
                },
            },
            currentTest: {
                name: 'name',
                module: 'module',
            },
        },
    },
};

let instance;
describe('Given captureElementScreenshot is constructed', () => {
    instance = Object.assign(new CaptureElementScreenshot(), mockInstance);

    test('Then is a class', () => {
        expect(instance).toBeInstanceOf(CaptureElementScreenshot);
    });

    test('Then it inherits from EventEmitter', () => {
        expect(CaptureElementScreenshot.prototype).toBeInstanceOf(EventEmitter);
    });

    test('Then it implements a method "command"', () => {
        expect(instance).toHaveProperty('command');
        expect(typeof instance.command).toEqual('function');
    });

    let commandResult;
    describe('When command is called', () => {
        beforeAll(() => {
            commandResult = instance.command();
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        test('Then it returns itself', () => {
            expect(commandResult).toEqual(instance);
        });

        test('Then execute has been called once', () => {
            expect(mockInstance.client.api.execute).toHaveBeenCalledTimes(1);
        });

        test('Then perform has been called twice', () => {
            expect(mockInstance.client.api.perform).toHaveBeenCalledTimes(2);
        });

        test('Then generatePaths has been called once', () => {
            expect(generatePaths).toHaveBeenCalledTimes(1);
        });
    });
});

