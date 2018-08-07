import bodyParser from 'body-parser';
import express from 'express';
import exphbs from 'express-handlebars';
import path from 'path';
import opn from 'opn';
import approve from './regression-approver';

export default function serve(port, results, settings) {
    const app = express();
    let server;

    app.engine('handlebars', exphbs());

    app.set('views', path.join(__dirname, '/views'));
    app.set('view engine', 'handlebars');

    app.use(bodyParser.json());

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
        approve(results.requiresApproval[req.body.id]);
        res.send('OK');
    });

    app.use(`/${settings.expectedPath}`, express.static(settings.expectedPath));
    app.use(`/${settings.actualPath}`, express.static(settings.actualPath));

    server = app.listen(port, () => {
        console.log('Opening closed');
        opn(`http://localhost:${port}`);
    });
}
