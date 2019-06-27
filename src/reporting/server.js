import bodyParser from 'body-parser';
import express from 'express';
import exphbs from 'express-handlebars';
import path from 'path';
import opn from 'opn';
import normalisePath from 'normalize-path';
import approve from './regression-approver';

export default function serve(port, results, settings) {
    const app = express();
    let server;

    const viewsPath = path.join(__dirname, '/views');
    app.engine('handlebars', exphbs({ defaultLayout: 'index.handlebars', layoutsDir: viewsPath }));

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

    app.use(normalisePath(`/${settings.expectedPath}`), express.static(settings.expectedPath));
    app.use(normalisePath(`/${settings.actualPath}`), express.static(settings.actualPath));
    app.use(normalisePath('/viewerjs'), express.static('./node_modules/viewerjs/dist'));

    server = app.listen(port, () => {
        console.log('Your report is ready!');

        opn(`http://localhost:${port}`).catch(() => {
            console.log('Unable to open remote browser');
            console.log(`Your report is available here: http://localhost:${port}`);
        });
    });
}
