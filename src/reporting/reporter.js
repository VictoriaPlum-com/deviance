import prompt from 'prompt/lib/prompt';
import serve from './server';
import ResultsFormatter from './results-formatter';

export default {
    write: (results, settings) => {
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

        prompt.get(schema, (errors, { report }) => {
            if (errors) {
                throw errors;
            }

            if (report === 'yes') {
                const port = 8083;
                const formatter = new ResultsFormatter(settings.regression);
                serve(port, formatter.format(results), settings.regression);
            }
        });
    },
};
