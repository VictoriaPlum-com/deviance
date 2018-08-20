import fs from 'fs-extra';
import uuidv4 from 'uuid/v4';
import AnsiUp from 'ansi_up';
import generatePaths from '../path-generator';

export default function Formatter(settings) {
    const ansiUp = new AnsiUp();

    function format(results) {
        results.requiresApproval = [];

        const re = /Deviance regression .*{(.*)}/;
        Object.entries(results.modules).forEach(([testModule, { completed, errmessages }]) => {
            results.modules[testModule].htmlErrorMsgs = [];
            Object.entries(completed).forEach(([testName, { assertions }]) => {
                assertions.forEach((assertion) => {
                    [assertion.message] = assertion.message.split(' - expected');
                    const match = assertion.fullMsg.match(re);

                    if (match === null) {
                        return;
                    }

                    const [, fileName] = match;

                    assertion.message = assertion.message.replace(/{.*}/, '');

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

            if (errmessages) {
                errmessages.forEach((message) => {
                    const htmlErrorMessage = ansiUp.ansi_to_html(message);
                    results.modules[testModule].htmlErrorMsgs.push(htmlErrorMessage);
                });
            }
        });

        return results;
    }

    return { format };
}
