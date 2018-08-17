import { EventEmitter } from 'events';
import ResizeBrowserToBodyHeight from '../../src/commands/resizeBrowserToBodyHeight';

const mockExecute = jest.fn((browser, data, cb) => cb({ value: 2 }));
const mockResize = jest.fn((w, h, cb) => cb());
const mockInstance = {
    client: {
        api: {
            execute: mockExecute,
            resizeWindow: mockResize,
            globals: {
                deviance: {
                    regression: {
                        resizeAdjustment: 10,
                    },
                },
            },
        },
    },
    emit: jest.fn(),
};

describe('Given ResizeBrowserToBodyHeight', () => {
    const instance = Object.assign(new ResizeBrowserToBodyHeight(), mockInstance);

    it('Then is a class', () => {
        expect(instance).toBeInstanceOf(ResizeBrowserToBodyHeight);
    });

    it('Then it inherits from EventEmitter', () => {
        expect(ResizeBrowserToBodyHeight.prototype).toBeInstanceOf(EventEmitter);
    });

    it('Then it implements a method "command"', () => {
        expect(instance).toHaveProperty('command');
        expect(typeof instance.command).toEqual('function');
    });

    describe('When ResizeBrowserToBodyHeight.command is called', () => {
        const commandResult = instance.command();

        it('Then it returns itself', () => {
            expect(commandResult).toEqual(instance);
        });

        it('Then emit is called once', () => {
            expect(instance.emit).toHaveBeenCalledTimes(1);
        });

        it('Then api.execute has been called once', () => {
            expect(mockExecute).toHaveBeenCalledTimes(1);
        });

        it('Then api.resizeWindow has been called once', () => {
            expect(mockResize).toHaveBeenCalledTimes(1);
        });
    });
});
