import fs from 'fs';

export default function approve(assertion) {
    const { expected, actual, diff } = assertion.filePath;

    fs.unlinkSync(diff);
    fs.unlinkSync(expected);
    fs.renameSync(actual, expected);

    assertion.filePath.diff = null;
    assertion.filePath.actual = null;
    assertion.failure = false;

    assertion.message.replace('(fail)', '(approved)');
}
