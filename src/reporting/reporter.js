import serve from './server';
import ResultsFormatter from './results-formatter';
import { hasProperty } from '../helpers';

export default {
    write: (results, settings) => {
        let reportEnabled = settings.reporting.enabled;
        if (hasProperty(process.env, 'OPEN_REPORT')) {
            reportEnabled = process.env.OPEN_REPORT;
        }

        if (reportEnabled) {
            const formatter = new ResultsFormatter(settings.regression);
            serve(settings.reporting.port, formatter.format(results), settings.regression);
        }
    },
};
