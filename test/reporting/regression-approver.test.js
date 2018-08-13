import fs from 'fs-extra';
import approve from '../../src/reporting/regression-approver';

jest.mock('fs-extra');

let mockData;

describe('Given approve', () => {
    beforeAll(() => {
        mockData = {
            filePath: {
                expected: 'mock/expected/file/path/img.png',
                actual: 'mock/actual/file/path/img.png',
                diff: 'mock/diff/file/path/img.png',
            },
            isNew: false,
            failure: null,
            message: 'mock message (fail)',
        };
        approve(mockData);
    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    describe('When assertion is not new', () => {
        it('Then fs.unlinkSync should be called 2 times', () => {
            expect(fs.unlinkSync).toHaveBeenCalledTimes(2);
        });
        it('Then fs.unlinkSync should be called with diff path', () => {
            expect(fs.unlinkSync).toHaveBeenCalledWith('mock/diff/file/path/img.png');
        });

        it('Then fs.unlinkSync should be called with expected path', () => {
            expect(fs.unlinkSync).toHaveBeenCalledWith('mock/expected/file/path/img.png');
        });

        it('Then sets diff filePath to null', () => {
            expect(mockData.filePath.diff).toBeNull();
        });
    });

    describe('When assertion', () => {
        it('Then ensureDirSync should be called once', () => {
            expect(fs.ensureDirSync).toHaveBeenCalledTimes(1);
        });

        it('Then ensureDirSync should be called with expected directory path', () => {
            expect(fs.ensureDirSync).toHaveBeenCalledWith('mock/expected/file/path');
        });

        it('Then renameSync should be called once', () => {
            expect(fs.renameSync).toHaveBeenCalledTimes(1);
        });

        it('Then renameSync should be called with actual and expected paths', () => {
            expect(fs.renameSync).toBeCalledWith('mock/actual/file/path/img.png', 'mock/expected/file/path/img.png');
        });

        it('Then sets actual filePath to null', () => {
            expect(mockData.filePath.actual).toBeNull();
        });

        it('Then failure is set to false ', () => {
            expect(mockData.failure).toBe(false);
        });

        it('Then message text "(fail) is replaced with "(approved)"', () => {
            expect(mockData.message).toContain('(approved)');
        });
    });
});

describe('Given approve using a new image to approve', () => {
    beforeAll(() => {
        mockData = {
            filePath: {
                expected: '',
                actual: 'mock/actual/file/path/img.png',
                diff: '',
            },
            isNew: true,
            failure: null,
            message: 'mock message (new)',
        };
        approve(mockData);
    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    describe('When assertion is new', () => {
        it('Then unlinkSync is not called', () => {
            expect(fs.unlinkSync).not.toHaveBeenCalled();
        });

        it('Then isNew should be set to false', () => {
            expect(mockData.isNew).toBe(false);
        });

        it('Then message text "(new)" is replaced with "(approved)"', () => {
            expect(mockData.message).toContain('(approved)');
        });
    });
});
