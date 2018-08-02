import fs from 'fs';
import generatePaths from '../path-generator';
import uuidv4 from 'uuid/v4';

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

                    assertion.filePath = {};
                    const possiblePaths = generatePaths(settings, fileName, testName, testModule);
                    Object.entries(possiblePaths).forEach(([k, path]) => {
                        if (fs.existsSync(path)) {
                            assertion.filePath[k] = path;
                            assertion.id = uuidv4();

                            results.requiresApproval[assertion.id] = assertion;
                        }
                    });
                });
            });
        });

        return results;
    }

    return {
        format,
    };
}
