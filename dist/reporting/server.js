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

var _normalizePath = require('normalize-path');

var _normalizePath2 = _interopRequireDefault(_normalizePath);

var _regressionApprover = require('./regression-approver');

var _regressionApprover2 = _interopRequireDefault(_regressionApprover);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let server;
let closer;

function setCloser(timeout = 4000) {
    if (closer) {
        clearTimeout(closer);
    }

    closer = setTimeout(() => {
        server.close();
        console.log('Report closed');
        process.exit();
    }, timeout);
}

function serve(port, results, settings) {
    const app = (0, _express2.default)();

    const viewsPath = _path2.default.join(__dirname, '/views');
    app.engine('handlebars', (0, _expressHandlebars2.default)({ defaultLayout: 'index.handlebars', layoutsDir: viewsPath }));

    app.set('views', _path2.default.join(__dirname, '/views'));

    app.set('view engine', 'handlebars');

    app.use(_bodyParser2.default.json());

    app.get('/', (req, res) => {
        res.render('index', { results });
    });

    setCloser();
    app.post('/keep-alive', (req, res) => {
        setCloser();
        res.send('OK');
    });

    app.post('/approve', (req, res) => {
        (0, _regressionApprover2.default)(results.requiresApproval[req.body.id]);
        res.send('OK');
    });

    app.use((0, _normalizePath2.default)(`/${settings.expectedPath}`), _express2.default.static(settings.expectedPath));
    app.use((0, _normalizePath2.default)(`/${settings.actualPath}`), _express2.default.static(settings.actualPath));
    app.use((0, _normalizePath2.default)('/viewerjs'), _express2.default.static('./node_modules/viewerjs/dist'));

    if (settings.screenshotsPath) {
        app.use((0, _normalizePath2.default)(`/${settings.screenshotsPath}`), _express2.default.static(settings.screenshotsPath));
    }

    server = app.listen(port, () => {
        console.log('Your report is ready!');

        (0, _opn2.default)(`http://localhost:${port}`).catch(() => {
            console.log('Unable to open remote browser');
            console.log(`Your report is available here: http://localhost:${port}`);
        });
    });
}