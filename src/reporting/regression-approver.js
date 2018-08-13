import fs from 'fs-extra';
import path from 'path';

export default function approve(assertion) {
    const { expected, actual, diff } = assertion.filePath;

    if (!assertion.isNew) {
        fs.unlinkSync(diff);
        fs.unlinkSync(expected);
        assertion.filePath.diff = null;
    }

    fs.ensureDirSync(path.dirname(expected));
    fs.renameSync(actual, expected);

    assertion.filePath.actual = null;
    assertion.failure = false;
    assertion.isNew = false;

    assertion.message = assertion.message.replace('(fail)', '(approved)');
    assertion.message = assertion.message.replace('(new)', '(approved)');
}
