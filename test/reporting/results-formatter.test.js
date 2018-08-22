import fs from 'fs-extra';
import uuidv4 from 'uuid/v4';
import Formatter from '../../src/reporting/results-formatter';
import generatePaths from '../../src/path-generator';

jest.mock('fs-extra');
jest.mock('uuid/v4');
jest.mock('../../src/path-generator');

const mockFilePaths = {
    devianceFilePath: {
        actual: 'mock/actual/mockTestSuite/mockTestName/result.png',
        diff: 'mock/actual/mockTestSuite/mockTestName/diff/result.png',
        expected: 'mock/expected/mockTestSuite/mockTestName/result.png',
    },
};

generatePaths.mockReturnValue(mockFilePaths);

let instance;

describe('Given Formatter', () => {
    it('Then is a function', () => {
        expect(typeof Formatter).toBe('function');
    });

    describe('When provided valid settings', () => {
        beforeAll(() => {
            const mockSettings = {
                expectedPath: 'mock/expected',
                actualPath: 'mock/actual',
                threshold: 0.001,
                hasDevianceCaptured: true,
            };

            instance = new Formatter(mockSettings);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('Then should return an object', () => {
            expect(typeof instance).toBe('object');
        });

        it('Then format function is available', () => {
            expect(typeof instance.format).toBe('function');
        });

        describe('When format function provided valid results', () => {
            let formatResults;
            const mockResults = {
                modules: {
                    mockTestSuite: {
                        completed: {
                            mockTestName: {
                                assertions: [
                                    {
                                        message: 'Deviance regression <result> {result} - expected something',
                                        fullMsg: 'Deviance regression <result> {result} - expected something',
                                    },
                                ],
                            },
                        },
                    },
                    mockTestSuite2: {
                        completed: {
                            mockTestName2: {
                                assertions: [
                                    {
                                        message: 'Deviance regression <result> {result} - expected something',
                                        fullMsg: 'Deviance regression <result> {result} - expected something',
                                    },
                                ],
                            },
                        },
                    },
                },
            };

            beforeAll(() => {
                formatResults = instance.format(mockResults);
            });

            afterAll(() => {
                jest.clearAllMocks();
            });

            it('Then it returns an object', () => {
                expect(typeof formatResults).toBe('object');
            });

            it('Then it removes " - expected" and following text from the message', () => {
                expect(formatResults.modules.mockTestSuite.completed.mockTestName.assertions[0].message).toBe('Deviance regression <result> ');
            });

            it('Then uuidv4 is called for each assertion', () => {
                expect(uuidv4).toHaveBeenCalledTimes(2);
            });

            it('Then generatePaths is called for each assertion', () => {
                expect(generatePaths).toHaveBeenCalledTimes(2);
            });

            it('Then fs.existsSync is called for each assertion', () => {
                expect(fs.existsSync).toHaveBeenCalledTimes(2);
            });
        });
    });
});
