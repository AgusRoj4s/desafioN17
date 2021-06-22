const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const handlebars = require('express-handlebars');
const routes = require('./routes/index')
const productos = require('./api/productos');


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

const puerto = 8080;
io.on('connect', socket => {
    console.log('usuario conectado');
    socket.emit('lista', productos.listar())
});

http.listen(puerto, () => {
    console.log(`Servidor escuchando en http://localhost:${puerto}`);
});