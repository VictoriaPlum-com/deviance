import { EventEmitter } from 'events';
import CaptureElementScreenshot from '../../src/commands/captureElementScreenshot';
import execute from '../../src/regression/promises/execute';
import elementSize from '../../src/regression/promises/elementSize';
import jimpifyScreenshots from '../../src/regression/promises/jimpifyScreenshots';
import locationInView from '../../src/regression/promises/locationInView';
import generatePaths from '../../src/path-generator';
import processImages from '../../src/regression/processImages';

jest.mock('../../src/regression/promises/execute');
jest.mock('../../src/regression/promises/elementSize');
jest.mock('../../src/regression/promises/jimpifyScreenshots');
jest.mock('../../src/regression/promises/locationInView');
jest.mock('../../src/path-generator');
jest.mock('../../src/regression/processImages');

const mockInstance = {
    emit: jest.fn(),
    client: {
        api: {
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

    it('Then is a class', () => {
        expect(instance).toBeInstanceOf(CaptureElementScreenshot);
    });

    it('Then it inherits from EventEmitter', () => {
        expect(CaptureElementScreenshot.prototype).toBeInstanceOf(EventEmitter);
    });

    it('Then it implements a method "command"', () => {
        expect(instance).toHaveProperty('command');
        expect(typeof instance.command).toEqual('function');
    });

    let commandResult;
    describe('When command is called and apiActions reject', () => {
        beforeAll(() => {
            const reject = Promise.reject(new Error('Error'));
            execute.mockReturnValue(reject);
            locationInView.mockReturnValue(reject);
            elementSize.mockReturnValue(reject);
            jimpifyScreenshots.mockReturnValue(reject);
            instance = Object.assign(new CaptureElementScreenshot(), mockInstance);
            commandResult = instance.command();
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('Then it returns itself', () => {
            expect(commandResult).toEqual(instance);
        });

        it('Then emit is called once if actions fail', () => {
            expect(instance.emit).toHaveBeenLastCalledWith('error');
        });

        it('Then execute has been called once', () => {
            expect(execute).toHaveBeenCalledTimes(1);
        });

        it('Then elementSize has been called once', () => {
            expect(elementSize).toHaveBeenCalledTimes(1);
        });

        it('Then jimpifyScreenshots has been called once', () => {
            expect(jimpifyScreenshots).toHaveBeenCalledTimes(1);
        });

        it('Then locationInView has been called once', () => {
            expect(locationInView).toHaveBeenCalledTimes(1);
        });

        it('Then generatePaths has been called once', () => {
            expect(generatePaths).toHaveBeenCalledTimes(1);
        });

        it('Then processImages has not been called', () => {
            expect(processImages).toHaveBeenCalledTimes(0);
        });
    });

    describe('When command is called and apiActions resolve', () => {
        beforeAll(() => {
            execute.mockReturnValue(Promise.resolve(1));
            locationInView.mockReturnValue(Promise.resolve({ x: 4, y: 5 }));
            elementSize.mockReturnValue(Promise.resolve({ width: 2, height: 3 }));
            jimpifyScreenshots.mockReturnValue(Promise.resolve([{}, {}]));
            instance = Object.assign(new CaptureElementScreenshot(), mockInstance);
            commandResult = instance.command();
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('Then it returns itself', () => {
            expect(commandResult).toEqual(instance);
        });

        it('Then emit is called once if actions succeed', () => {
            expect(instance.emit).toHaveBeenLastCalledWith('complete');
        });

        it('Then execute has been called once', () => {
            expect(execute).toHaveBeenCalledTimes(1);
        });

        it('Then elementSize has been called once', () => {
            expect(elementSize).toHaveBeenCalledTimes(1);
        });

        it('Then jimpifyScreenshots has been called once', () => {
            expect(jimpifyScreenshots).toHaveBeenCalledTimes(1);
        });

        it('Then locationInView has been called once', () => {
            expect(locationInView).toHaveBeenCalledTimes(1);
        });

        it('Then generatePaths has been called once', () => {
            expect(generatePaths).toHaveBeenCalledTimes(1);
        });

        it('Then processImages has been called once', () => {
            expect(processImages).toHaveBeenCalledTimes(1);
        });
    });
});

