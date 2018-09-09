import bodyParser from 'body-parser';
import express from 'express';
import exphbs from 'express-handlebars';
import path from 'path';
import opn from 'opn';
import approve from './regression-approver';

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

export default function serve(port, results, settings) {
    const app = express();

    app.engine('handlebars', exphbs());

    app.set('views', path.join(__dirname, '/views'));
    app.set('view engine', 'handlebars');

    app.use(bodyParser.json());

    app.get('/', (req, res) => {
        res.render('index', { results });
    });

    setCloser();
    app.post('/keep-alive', (req, res) => {
        setCloser();
        res.send('OK');
    });

    app.post('/approve', (req, res) => {
        approve(results.requiresApproval[req.body.id]);
        res.send('OK');
    });

    app.use(`/${settings.expectedPath}`, express.static(settings.expectedPath));
    app.use(`/${settings.actualPath}`, express.static(settings.actualPath));
    app.use('/viewerjs', express.static('./node_modules/viewerjs/dist'));

    server = app.listen(port, () => {
        console.log('Opening report');
        opn(`http://localhost:${port}`);
    });
}
