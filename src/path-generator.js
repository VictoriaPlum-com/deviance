import path from 'path';

function replaceNonAlphaNumeric(value) {
    return value.replace(/[^a-z0-9]/gi, '-');
}

export default function generatePaths(settings, filename, testName, testModule) {
    const name = replaceNonAlphaNumeric(testName);
    const file = `${replaceNonAlphaNumeric(filename)}.png`;

    return {
        expected: path.join(settings.expectedPath, testModule, name, file),
        actual: path.join(settings.actualPath, testModule, name, file),
        diff: path.join(settings.actualPath, testModule, name, 'diff', file),
    };
}
