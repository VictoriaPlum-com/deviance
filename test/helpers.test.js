import each from 'jest-each';
import { hasProperty, getEnvironment, hasValidThreshold, buildCaptureAreas } from '../src/helpers';

describe('Given hasProperty', () => {
    const mockObject = {
        prop1: 'foo',
        prop2: 'bar',
    };

    test('Then it returns true if object has property', () => {
        expect(hasProperty(mockObject, 'prop1')).toBe(true);
    });

    test('Then it returns false if object does not have property', () => {
        expect(hasProperty(mockObject, 'prop3')).toBe(false);
    });
});

describe('Given getEnvironment', () => {
    describe('When no envFlag passed', () => {
        test('Then returns value of default', () => {
            expect(getEnvironment([])).toBe('default');
        });
    });

    describe('When envFlag passed', () => {
        test('Then returns value of passed string', () => {
            expect(getEnvironment(['-e', 'value'])).toBe('value');
        });
    });
});

describe('Given hasValidThreshold', () => {
    test('Then it returns false if value is over 1', () => {
        expect(hasValidThreshold(100)).toBe(false);
    });

    test('Then it returns false if value is under 0', () => {
        expect(hasValidThreshold(-1)).toBe(false);
    });

    test('Then it returns false if value is not a number', () => {
        expect(hasValidThreshold('number')).toBe(false);
    });

    test('Then it returns true for a valid value', () => {
        expect(hasValidThreshold(0.5)).toBe(true);
    });
});

describe('Given buildCaptureAreas', () => {
    const mockViewport = {
        width: 1, height: 1, left: 0, top: 0,
    };
    let mockElement = { width: 1, height: 1 };

    test('Then it returns an array', () => {
        expect(Array.isArray(buildCaptureAreas(mockElement, mockViewport))).toBeTruthy();
    });

    test('Then it divides the element width by the viewport width', () => {
        mockElement = { width: 2, height: 2 };
        expect(buildCaptureAreas(mockElement, mockViewport)).toHaveLength(4);
        mockElement = { width: 2, height: 1 };
        expect(buildCaptureAreas(mockElement, mockViewport)).toHaveLength(2);
    });

    describe('When the element is larger than the viewport', () => {
        mockElement = { width: 3, height: 3 };
        const mockResults = [
            { top: 0, left: 0, behavior: 'instant' },
            { top: 1, left: 0, behavior: 'instant' },
            { top: 2, left: 0, behavior: 'instant' },
            { top: 0, left: 1, behavior: 'instant' },
            { top: 1, left: 1, behavior: 'instant' },
            { top: 2, left: 1, behavior: 'instant' },
            { top: 0, left: 2, behavior: 'instant' },
            { top: 1, left: 2, behavior: 'instant' },
            { top: 2, left: 2, behavior: 'instant' },
        ];

        each(buildCaptureAreas(mockElement, mockViewport)).describe('For each result: pass %#', (item) => {
            test('Then the returned array values are objects', () => {
                expect(typeof item).toBe('object');
            });

            test('Then the returned array values have a "behavior" property', () => {
                expect(item).toHaveProperty('behavior');
            });

            test('Then the returned array values have a "top" property', () => {
                expect(item).toHaveProperty('top');
            });

            test('Then the returned array values have a "left" property', () => {
                expect(item).toHaveProperty('left');
            });

            test('Then the returned array values map x and y coords based on viewport values', () => {
                const matchValue = mockResults.shift();
                expect(item).toMatchObject(matchValue);
            });
        });
    });

    describe('When it is provided with a tangible element (it has dimension)', () => {
        test('Then it returns an array with elements', () => {
            mockElement = { width: 1, height: 1 };
            expect(buildCaptureAreas(mockElement, mockViewport)).toHaveLength(1);
        });
    });

    describe('When it is provided with a non-existant element (it has no dimensions)', () => {
        test('Then it returns an empty array', () => {
            mockElement = { width: 0, height: 0 };
            expect(buildCaptureAreas(mockElement, mockViewport)).toHaveLength(0);
        });
    });
});
