const fs = require('fs-extra');
const path = require('path');
const handlebars = require('handlebars');
const prompt = require('prompt');
const opn = require('opn');

module.exports = {
    write: (results, settings) => {
        const { outputPath } = settings;
        const templatePath = path.join(__dirname, 'templates', 'html-report.hbs');

        fs.readFile(templatePath, (err, data) => {
            if (err) {
                throw err;
            }

            const reportPath = path.join(process.cwd(), outputPath, `report-${Date.now()}.html`);
            const template = data.toString();
            const content = handlebars.compile(template)({
                results,
            });

            fs.ensureDirSync(path.dirname(reportPath));

            fs.writeFile(reportPath, content, (error) => {
                if (error) {
                    throw error;
                }

                prompt.start({ noHandleSIGINT: true });

                const schema = {
                    properties: {
                        report: {
                            description: 'Do you want to open generated report? (yes/no)',
                            type: 'string',
                            required: true,
                        },
                    },
                };

                prompt.get(schema, (errors, result) => {
                    if (errors) {
                        throw errors;
                    }

                    if (result.report === 'yes') {
                        opn(reportPath, { wait: false });
                    }
                });
            });
        });
    },
};
