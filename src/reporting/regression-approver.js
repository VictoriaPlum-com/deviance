import fs from 'fs-extra';
import path from 'path';

export default function approve(assertion) {
    const { expected, actual, diff } = assertion.devianceFilePath;

    if (!assertion.isNewDeviance) {
        fs.unlinkSync(diff);
        fs.unlinkSync(expected);
        assertion.devianceFilePath.diff = null;
    }

    fs.ensureDirSync(path.dirname(expected));
    fs.renameSync(actual, expected);

    assertion.devianceFilePath.actual = null;
    assertion.failure = false;
    assertion.isNewDeviance = false;

    assertion.message = assertion.message.replace('(fail)', '(approved)');
    assertion.message = assertion.message.replace('(new)', '(approved)');
}
