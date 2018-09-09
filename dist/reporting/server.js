'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = serve;

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _expressHandlebars = require('express-handlebars');

var _expressHandlebars2 = _interopRequireDefault(_expressHandlebars);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _opn = require('opn');

var _opn2 = _interopRequireDefault(_opn);

var _regressionApprover = require('./regression-approver');

var _regressionApprover2 = _interopRequireDefault(_regressionApprover);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function serve(port, results, settings) {
    const app = (0, _express2.default)();
    let server;

    app.engine('handlebars', (0, _expressHandlebars2.default)());

    app.set('views', _path2.default.join(__dirname, '/views'));
    app.set('view engine', 'handlebars');

    app.use(_bodyParser2.default.json());

    app.get('/', (req, res) => {
        res.render('index', { results });
    });

    app.post('/terminate', (req, res) => {
        res.send('Going away....');
        server.close();
        console.log('Report closed');
        process.exit();
    });

    app.post('/approve', (req, res) => {
        (0, _regressionApprover2.default)(results.requiresApproval[req.body.id]);
        res.send('OK');
    });

    app.use(`/${settings.expectedPath}`, _express2.default.static(settings.expectedPath));
    app.use(`/${settings.actualPath}`, _express2.default.static(settings.actualPath));
    app.use('/viewerjs', _express2.default.static('./node_modules/viewerjs/dist'));

    server = app.listen(port, () => {
        console.log('Opening report');
        (0, _opn2.default)(`http://localhost:${port}`);
    });
}