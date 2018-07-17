const fs = require('fs');
const path = require('path');

function encodeHtml(text) {
    return text.replace(/[\u00A0-\u9999<>&]/gim, i => `&#${i.charCodeAt(0)};`);
}

function parseErrors(messages) {
    let result = '';

    messages.forEach((message) => {
        result += `<li>${message}</li>`;
    });

    return result ? `
        <h2>Error messages</h2>
        <ul>
        ${result}
        </ul>` : '';
}

function parseTestCase(testName, testCase) {
    let result = '';

    testCase.assertions.forEach((assertion) => {
        result += `<li>${encodeHtml(assertion.message)}</li>\n`;
    });

    return `<h4>${testName} <small>Time: ${testCase.time}</small></h4>
        <ul>
            ${result}
        </ul>`;
}

function parseModules(modules) {
    let result = '';

    Object.entries(modules).forEach(([index, module]) => {
        let testCases = '';

        Object.entries(module.completed).forEach(([testName, testCase]) => {
            testCases += parseTestCase(testName, testCase);
        });

        result += `
    <h3>${index} <small>Time: ${module.time}</small></h3>
    <div>
        <ul>
            <li>Tests: ${module.tests}</li>
            <li>Failures: ${module.failures}</li>
            <li>Errors: ${module.errors}</li>
    
            <li>Assertions: ${module.assertionsCount}</li>
            <li>Passed: ${module.passedCount}</li>
            <li>Failed: ${module.failedCount}</li>
            <li>Skipped: ${module.skippedCount}</li>
            <li>Errors: ${module.errorsCount}</li>
        </ul>
        ${testCases}
    </div>`;
    });

    return result;
}

module.exports = {
    write: (results) => {
        const reportPath = path.join(process.env.PWD, 'reports', `report-${Date.now()}.html`);
        const errors = parseErrors(results.errmessages);
        const modules = parseModules(results.modules);
        const content = `
<html>
<head></head>
<body>
    <h1>Test report</h1>

    <h2>Summary</h2>
    <ul>
        <li>Passed: ${results.passed}</li>
        <li>Failed: ${results.failed}</li>
        <li>Errors: ${results.errors}</li>
        <li>Skipped: ${results.skipped}</li>
        <li>Tests: ${results.tests}</li>
        <li>Assertions: ${results.assertions}</li>        
    </ul>

    ${errors}

    ${modules}
</body>
</html>`;

        fs.writeFile(reportPath, content, (err) => {
            if (err) {
                throw err;
            }
        });
    },
};
