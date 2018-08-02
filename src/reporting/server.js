import express from 'express';
import exphbs from 'express-handlebars';
import path from 'path';
import bodyParser from 'body-parser';
import approve from './regression-approver';

export default function serve(port, results, settings) {
    const app = express();

    app.engine('handlebars', exphbs());

    app.set('views', path.join(__dirname, '/views'));
    app.set('view engine', 'handlebars');

    app.use(bodyParser.json());

    app.get('/', (req, res) => {
        res.render('index', { results });
    });

    app.post('/approve', (req, res) => {
        approve(results.requiresApproval[req.body.id]);
        res.send('OK');
    });

    app.use(`/${settings.expectedPath}`, express.static(settings.expectedPath));
    app.use(`/${settings.actualPath}`, express.static(settings.actualPath));

    app.listen(port, () => {
        console.log(`Report server listening on port: ${port}`);
    });
}
