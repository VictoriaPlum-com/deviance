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
                    [assertion.message] = assertion.message.split(' - expected');
                    const match = assertion.fullMsg.match(re);
                    if (match === null) {
                        return;
                    }

                    const [, fileName] = match;

                    assertion.devianceId = uuidv4();
                    assertion.devianceFilePath =
                        generatePaths(settings, fileName, testName, testModule);

                    assertion.isPassedDeviance = false;
                    const diffExists = fs.existsSync(assertion.devianceFilePath.diff);
                    if (!assertion.failure && diffExists) {
                        assertion.isPassedDeviance = true;
                        assertion.isNewDeviance = false;
                        return;
                    }

                    results.requiresApproval[assertion.devianceId] = assertion;
                    assertion.isNewDeviance = !diffExists;
                });
            });
        });

        return results;
    }

    return { format };
}
