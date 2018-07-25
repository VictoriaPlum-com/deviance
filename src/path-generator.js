const path = require('path');

export const types = {
    baseline: 0,
    current: 1,
    diff: 2,
};

export default function generatorPath(settings, filename, type = types.current) {
    let basePath;
    switch (type) {
    case types.baseline:
        basePath = settings.baselinePath;
        break;
    case types.current:
        basePath = settings.currentPath;
        break;
    case types.diff:
        basePath = path.join(settings.currentPath, 'diff');
        break;
    default:
        throw new Error('Invalid type provided for visual regression filename');
    }

    const combinedFilename = `${filename}.png`;

    return path.join(basePath, combinedFilename);
}

