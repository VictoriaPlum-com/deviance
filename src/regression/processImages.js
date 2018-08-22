import fs from 'fs-extra';
import Jimp from 'jimp';
import { hasProperty } from '../helpers';

export default function processImages(data, filenames, settings) {
    const {
        x, y, width, height, actual, expected,
    } = data;
    const results = {};

    if (!hasProperty(settings, 'hasDevianceCaptured')) {
        settings.hasDevianceCaptured = true;
        fs.emptyDirSync(settings.actualPath);
    }

    actual.crop(x, y, width, height)
        .quality(100)
        .write(filenames.actual);
    results.actual = {
        path: filenames.actual,
        width,
        height,
    };

    if (expected) {
        results.expected = {
            path: filenames.expected,
            width: expected.bitmap.width,
            height: expected.bitmap.height,
        };

        const diff = Jimp.diff(actual, expected);
        results.diff = {
            path: filenames.diff,
            percent: diff.percent,
        };
        diff
            .image
            .quality(100)
            .write(filenames.diff);
    }

    return results;
}
