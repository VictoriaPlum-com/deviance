import fs from 'fs-extra';
import Jimp from 'jimp';
import processImages from '../../src/regression/processImages';

jest.mock('fs-extra');
jest.mock('jimp');

let data;
const filenames = {
    expected: 'mock/expected/element.png',
    actual: 'mock/actual/element.png',
    diff: 'mock/diff/element.png',
};
let settings;
let result;

describe('Given processImages', () => {
    it('Then it is a function', () => {
        expect(typeof processImages).toBe('function');
    });

    describe('When provided with valid properties with hasDevianceCaptured defined in settings and without expected image data', () => {
        beforeAll(() => {
            data = {
                x: 16,
                y: 167,
                width: 123,
                height: 321,
                actual: {
                    crop: jest.fn((() => data.actual)),
                    quality: jest.fn((() => data.actual)),
                    write: jest.fn(),
                },
            };
            settings = {
                hasDevianceCaptured: true,
                expectedPath: 'mock/expected/',
                actualPath: 'mock/actual/',
                threshold: 0.001,
            };
            result = processImages(data, filenames, settings);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('Then fs.emptyDirSync is not called', () => {
            expect(fs.emptyDirSync).not.toHaveBeenCalled();
        });

        it('Then actual image is cropped as expected', () => {
            expect(data.actual.crop).toHaveBeenCalled();
        });

        it('Then actual image is saved with quality of 100', () => {
            expect(data.actual.quality).toHaveBeenCalled();
        });

        it('Then cropped actual image is written', () => {
            expect(data.actual.write).toHaveBeenCalled();
        });

        it('Then returns cropped actual image', () => {
            expect(result.actual).toEqual({
                path: filenames.actual, width: data.width, height: data.height,
            });
        });

        it('Then Jimp.diff is not called', () => {
            expect(Jimp.diff).not.toHaveBeenCalled();
        });

        it('Then result is an object', () => {
            expect(typeof result).toBe('object');
        });
    });

    describe('When provided with valid properties without hasDevianceCaptured', () => {
        beforeAll(() => {
            data = {
                x: 16,
                y: 167,
                width: 123,
                height: 321,
                actual: {
                    crop: jest.fn((() => data.actual)),
                    quality: jest.fn((() => data.actual)),
                    write: jest.fn(),
                },
            };
            settings = {
                expectedPath: 'mock/expected/',
                actualPath: 'mock/actual/',
                threshold: 0.001,
            };
            result = processImages(data, filenames, settings);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('Then hasDevianceCaptured should be set to true', () => {
            expect(settings.hasDevianceCaptured).toBe(true);
        });

        it('Then fs.emptyDirSync is not called', () => {
            expect(fs.emptyDirSync).toHaveBeenCalled();
        });
    });

    describe('When provided with valid properties with expected image data', () => {
        let mockDiffResponse;
        beforeAll(() => {
            data = {
                x: 16,
                y: 167,
                width: 123,
                height: 321,
                actual: {
                    crop: jest.fn((() => data.actual)),
                    quality: jest.fn((() => data.actual)),
                    write: jest.fn(),
                },
                expected: {
                    crop: jest.fn((() => data.expected)),
                    quality: jest.fn((() => data.expected)),
                    write: jest.fn(),
                    bitmap: {
                        width: 999,
                        height: 999,
                    },
                },
            };
            settings = {
                expectedPath: 'mock/expected/',
                actualPath: 'mock/actual/',
                threshold: 0.001,
            };

            mockDiffResponse = {
                percent: 10,
                image: {
                    quality: jest.fn(() => mockDiffResponse.image),
                    write: jest.fn(),
                },
            };

            Jimp.diff = jest.fn(() => mockDiffResponse);

            result = processImages(data, filenames, settings);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        describe('When diff actual and expected images', () => {
            it('Then Jimp.diff is called', () => {
                expect(Jimp.diff).toHaveBeenCalled();
            });
            it('Then returns diff path', () => {
                expect(result.diff.path).toEqual(filenames.diff);
            });

            it('Then returns diff percentage', () => {
                expect(result.diff.percent).toBe(10);
            });
        });

        it('Then diff image is saved with quality of 100', () => {
            expect(mockDiffResponse.image.quality).toHaveBeenCalled();
        });

        it('Then cropped diff image is written', () => {
            expect(mockDiffResponse.image.write).toHaveBeenCalled();
        });
    });
});
