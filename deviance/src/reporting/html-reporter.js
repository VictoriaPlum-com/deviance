const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

module.exports = {
    write: (results) => {
        const templatePath = path.join(__dirname, 'templates', 'html-report.hbs');

        fs.readFile(templatePath, (err, data) => {
            if (err) {
                throw err;
            }

            const reportPath = path.join(process.cwd(), 'output', `report-${Date.now()}.html`);
            const template = data.toString();
            const content = handlebars.compile(template)({
                results,
            });

            fs.writeFile(reportPath, content, (error) => {
                if (error) {
                    throw error;
                }
            });
        });
    },
};
