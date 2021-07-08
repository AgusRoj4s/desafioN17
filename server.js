const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const handlebars = require('express-handlebars');
const routes = require('./routes/index');
const productos = require('./api/productos');
const { horaFecha } = require('./utils/index');
const sqlite3 = require('./options/sqlite3');
const knex = require('knex')(sqlite3);

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
(async() => {
    try {
        await knex.schema.dropTableIfExists('productos');
        await knex.schema.createTable('productos', table => {
            table.increments('id').notNullable();
            table.string('name').notNullable();
            table.integer('price').notNullable();
            table.string('thumbnail').notNullable();
        }).then(() => {
            console.log('tabla productos cargada!');
        });
    } catch (error) {
        console.log(error)
    }
})();

io.on('connect', socket => {
    console.log('usuario conectado');
    socket.emit('lista', productos.listar());
    socket.emit('messages', messages);
    (async() => {
        try {
            await knex.schema.dropTableIfExists('mensajes');
            await knex.schema.createTable('mensajes', table => {
                table.increments('id').notNullable();
                table.string('mensajeChat').notNullable();
            }).then(() => {
                console.log('tabla chat cargada!');
            });
        } catch (error) {
            console.log(error)
        }
    })();

    socket.on('new-message', data => {
        (async() => {
            try {
                data.hour = horaFecha();
                messages.push(data);
                dato = JSON.stringify(data);
                let variable = {
                    mensajeChat: dato
                }
                await knex('mensajes').insert(variable);
                await io.sockets.emit('messages', messages);
                await console.log('Mensaje Guardado!');
            } catch (error) {
                console.log(error)
            }
        })();
    });
});

http.listen(puerto, () => {
    console.log(`Servidor escuchando en http://localhost:${puerto}`);
});