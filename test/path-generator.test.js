import generatePaths from '../src/path-generator';

describe('Given gereratePaths', () => {
    let mockSettings;
    let mockFilename;
    let mockTestName;
    let mockTestModule;
    let pathResult;
    describe('When provided with the correct properties', () => {
        beforeAll(() => {
            mockSettings = {
                expectedPath: 'regression/expected/default',
                actualPath: 'output/deviance/regression/actual/default',
                hasDevianceCaptured: true,
            };
            mockFilename = 'fileName';
            mockTestName = 'testName';
            mockTestModule = 'groupA/testModule';

            pathResult = generatePaths(mockSettings, mockFilename, mockTestName, mockTestModule);
        });

        it('Then the returned expected path is as expected', () => {
            expect(pathResult.expected).toBe(`${mockSettings.expectedPath}/${mockTestModule}/${mockTestName}/${mockFilename}.png`);
        });

        it('Then the returned actual path is as expected', () => {
            expect(pathResult.actual).toBe(`${mockSettings.actualPath}/${mockTestModule}/${mockTestName}/${mockFilename}.png`);
        });

        it('Then the returned diff path is as expected', () => {
            expect(pathResult.diff).toBe(`${mockSettings.actualPath}/${mockTestModule}/${mockTestName}/diff/${mockFilename}.png`);
        });
    });

    describe('When provided with properties containing none alpha numeric characters', () => {
        beforeAll(() => {
            mockSettings = {
                expectedPath: 'regression/expected/default',
                actualPath: 'output/deviance/regression/actual/default',
                hasDevianceCaptured: true,
            };

            mockFilename = 'fileName with spaces';
            mockTestName = 'testNameWith&Ampersand';
            mockTestModule = 'groupA/testModule';

            pathResult = generatePaths(mockSettings, mockFilename, mockTestName, mockTestModule);
        });

        it('Then the returned expected path is as expected', () => {
            expect(pathResult.expected).toContain('testNameWith-Ampersand');
        });

        it('Then the returned actual path is as expected', () => {
            expect(pathResult.actual).toContain('fileName-with-spaces');
        });
    });
});

