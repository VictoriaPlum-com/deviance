'use strict';

var _prompt = require('prompt/lib/prompt');

var _prompt2 = _interopRequireDefault(_prompt);

var _server = require('./server');

var _server2 = _interopRequireDefault(_server);

var _resultsFormatter = require('./results-formatter');

var _resultsFormatter2 = _interopRequireDefault(_resultsFormatter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
    write: (results, settings) => {
        _prompt2.default.start({ noHandleSIGINT: true });

        const schema = {
            properties: {
                report: {
                    description: 'Do you want to open generated report? (yes/no)',
                    type: 'string',
                    required: true
                }
            }
        };

        console.log("prepromt");
        _prompt2.default.get(schema, (errors, { report }) => {
            if (errors) {
                throw errors;
            }

            if (report === 'yes') {
                const port = 8083;
                const formatter = new _resultsFormatter2.default(settings.regression);
                (0, _server2.default)(port, formatter.format(results), settings.regression);
            }
        });
    }
};