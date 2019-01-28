'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _server = require('./server');

var _server2 = _interopRequireDefault(_server);

var _resultsFormatter = require('./results-formatter');

var _resultsFormatter2 = _interopRequireDefault(_resultsFormatter);

var _helpers = require('../helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    write: (results, settings) => {
        let reportEnabled = settings.reporting.enabled;
        if ((0, _helpers.hasProperty)(process.env, 'OPEN_REPORT')) {
            reportEnabled = process.env.OPEN_REPORT === 'true';
        }

        if (reportEnabled) {
            const formatter = new _resultsFormatter2.default(settings.regression);
            (0, _server2.default)(settings.reporting.port, formatter.format(results), settings.regression);
        }
    }
};