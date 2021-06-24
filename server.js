const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const handlebars = require('express-handlebars');
const routes = require('./routes/index')
const productos = require('./api/productos');
const fs = require('fs')


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
let messages = [];

function horaFecha() {
    let hoy = new Date();
    let fecha = hoy.getDate() + '/' + (hoy.getMonth() + 1) + '/' + hoy.getFullYear();
    let hora = hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds();
    return fecha + " " + hora;
}


io.on('connect', socket => {
    console.log('usuario conectado');
    socket.emit('lista', productos.listar());
    socket.emit('messages', messages);
    socket.on('new-message', data => {
        data.hour = horaFecha();
        messages.push(data);
        fs.appendFileSync('./chat.txt', JSON.stringify(data));
        io.sockets.emit('messages', messages);
    });
});

http.listen(puerto, () => {
    console.log(`Servidor escuchando en http://localhost:${puerto}`);
});