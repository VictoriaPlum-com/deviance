'use strict';

const fs = require('fs-extra');
const path = require('path');
const handlebars = require('handlebars');
const opn = require('opn');

module.exports = {
    write: (results, settings) => {
        const { outputPath, openReport } = settings;
        const templatePath = path.join(__dirname, 'templates', 'html-report.hbs');

        fs.readFile(templatePath, (err, data) => {
            if (err) {
                throw err;
            }

            const reportPath = path.join(process.cwd(), outputPath, `report-${Date.now()}.html`);
            const template = data.toString();
            const content = handlebars.compile(template)({
                results
            });

            fs.ensureDirSync(path.dirname(reportPath));

            fs.writeFile(reportPath, content, error => {
                if (error) {
                    throw error;
                }

                const showReport = process.env.OPEN_REPORT || openReport;

                if (showReport) {
                    opn(reportPath, { wait: false });
                }
            });
        });
    }
};