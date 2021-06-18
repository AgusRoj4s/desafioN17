const express = require('express');
const handlebars = require('express-handlebars');
const routes = require('./routes/index')
    // creo una app de tipo express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/', routes());

app.engine('hbs', handlebars({
    extname: '.hbs',
    defaultLayout: 'index.hbs',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials'
}));

app.set('view engine', 'hbs');
app.set('views', './views');
app.use(express.static('public'));

// pongo a escuchar el servidor en el puerto indicado
const puerto = 8080;
const server = app.listen(puerto, () => {
    console.log(`servidor escuchando en http://localhost:${puerto}`);
});

// en caso de error, avisar
server.on('error', error => {
    console.log('error en el servidor:', error);
});