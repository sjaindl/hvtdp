// These are important and needed before anything else
//import 'zone.js/dist/zone-node';
require('zone.js/dist/zone-node')
require('reflect-metadata')
// import 'reflect-metadata';

import {renderModuleFactory} from '@angular/platform-server';
import {enableProdMode} from '@angular/core';

import * as express from 'express';
// import {join} from 'path';
import {readFileSync} from 'fs';

const {AppServerModuleNgFactory} = require('./dist-server/main'); //bundle?

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server
const app = express();

// const PORT = process.env.PORT || 4000;
// const DIST_FOLDER = join(process.cwd(), 'dist');
// const template = readFileSync(join(DIST_FOLDER, 'hvtdp', 'index.html')).toString();

// // * NOTE :: leave this as require() since this file is built Dynamically from webpack
// const {AppServerModuleNgFactory, LAZY_MODULE_MAP} = require('./dist/my-project-server/main');

// const {provideModuleMap} = require('@nguniversal/module-map-ngfactory-loader');

// app.engine('html', (_, options, callback) => {
//   renderModuleFactory(AppServerModuleNgFactory, {
//     // Our index.html
//     document: template,
//     // document: '<app-root></app-root>',
//     url: options.req.url,
//     // DI so that we can get lazy-loading to work differently (since we need it to just instantly render it)
//     extraProviders: [
//       provideModuleMap(LAZY_MODULE_MAP)
//     ]
//   }).then(html => {
//     callback(null, html);
//   });
// });

// app.set('view engine', 'html');
// app.set('views', join(DIST_FOLDER, 'browser'));

// const universal = (req, res) => {
//   res.render(join(DIST_FOLDER, 'hvtdp', 'index.html'), {req});
// };

// // Server static files from /browser
// app.get('*.js', express.static(join(DIST_FOLDER, 'hvtdp')));
// app.get('*.js.map', express.static(join(DIST_FOLDER, 'hvtdp')));

// // All regular routes use the Universal engine
// app.get('/', universal);
// app.get('/sub', universal);
// app.get('/lazy', universal);

// app.get('*', (req, res) => {
//   res.status(404).send('');
// });

// // Start up the Node server
// app.listen(PORT, () => {
//   console.log(`Node server listening on http://localhost:${PORT}`);
// });

const indexHtml = readFileSync(__dirname + '/dist/hvtdp/index.html', 'utf-8').toString();


app.get('*.*', express.static(__dirname + '/dist/hvtdp', {
    maxAge: '1y'
}));

app.route('*').get((req, res) => {

    renderModuleFactory(AppServerModuleNgFactory, {
        document: indexHtml,
        url: req.url
    })
        .then(html => {
            res.status(200).send(html);
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        });

});

app.listen(9000, () => {
    console.log(`Angular Universal Node Express server listening on http://localhost:9000`);
});
