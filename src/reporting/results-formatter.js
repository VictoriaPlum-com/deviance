import fs from 'fs';
import uuidv4 from 'uuid/v4';
import generatePaths from '../path-generator';

export default function Formatter(settings) {
    function format(results) {
        results.requiresApproval = [];

        const re = /Deviance regression .*<(.*)>/;
        Object.entries(results.modules).forEach(([testModule, { completed }]) => {
            Object.entries(completed).forEach(([testName, { assertions }]) => {
                assertions.forEach((assertion) => {
                    const match = assertion.fullMsg.match(re);
                    if (match === null) {
                        return;
                    }

                    const [, fileName] = match;

                    assertion.id = uuidv4();
                    assertion.filePath = generatePaths(settings, fileName, testName, testModule);
                    results.requiresApproval[assertion.id] = assertion;

                    assertion.isNew = !fs.existsSync(assertion.filePath.diff);
                });
            });
        });

        return results;
    }

    return { format };
}
