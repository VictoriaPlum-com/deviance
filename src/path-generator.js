const path = require('path');

export const types = {
    expected: 0,
    actual: 1,
    diff: 2,
};

export default function generatePath(
    settings,
    filename,
    type = types.actual,
) {
    let basePath;
    switch (type) {
    case types.expected:
        basePath = settings.expectedPath;
        break;
    case types.actual:
        basePath = settings.actualPath;
        break;
    case types.diff:
        basePath = path.join(settings.actualPath, 'diff');
        break;
    default:
        throw new Error('Invalid type provided for visual regression filename');
    }

    const combinedFilename = `${filename}.png`;

    return path.join(basePath, combinedFilename);
}

