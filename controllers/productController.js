const productos = require('../api/productos');
const sqlite3 = require('../options/sqlite3');
const knex = require('knex')(sqlite3);

exports.getProducts = (req, res) => {
    let prod = productos.listar()
    if (prod == 0) {
        res.json({ error: 'no hay productos cargados' })
    } else {
        knex.from('productos').select('*')
            .then(rows => {
                for (row of rows) {
                    console.log(`PRODUCTOS : [[${row['name']}] [${row['price']}] [${row['thumbnail']}]]`);
                }
            }).catch(error => {
                console.log('error:', error);
            });
        res.json(prod)
    }
};

exports.getOneProduct = (req, res) => {
    let prod = productos.listarID(req.params.id)
    if (prod == 0) {
        res.json({ error: 'producto no encontrado' })
    } else {
        knex.from('productos').select('name', 'price', 'thumbnail').where('id', '=', req.params.id)
            .then(rows => {
                for (row of rows) {
                    console.log(`PRODUCTO : [[${row['name']}] [${row['price']}] [${row['thumbnail']}]]`);
                }
            }).catch(error => {
                console.log('error:', error);
            });
        res.json(prod)
    }
};

exports.saveProduct = (req, res) => {
    let prod = productos.guardar(req.body)
    let product = {
        name: prod.title,
        price: prod.price,
        thumbnail: prod.thumbnail
    }
    knex('productos').insert(product)
        .then(() => {
            console.log('producto agregado a la tabla');
        }).catch(error => {
            console.log('error:', error);
        });
    res.redirect('/')
};

exports.updateProduct = (req, res) => {
    let prod = productos.listarID(req.params.id)
    if (prod == 0) {
        res.json({ error: 'no se pudo actualizar el producto {ID Erroneo}' })
    } else {
        let actualizado = productos.actualizar(req.params.id, req.body)
        if (actualizado == 0) {
            res.json({ error: 'no se pudo actualizar el producto {ID Erroneo}' })
        } else {
            res.json(prod)
            knex.from('productos').where('id', req.params.id).update({ name: actualizado.title, price: actualizado.price, thumbnail: actualizado.thumbnail })
                .then(() => {
                    console.log('producto actualizado')
                }).catch(error => {
                    console.log('error:', error);
                });
        }
    }
};

exports.deleteProduct = (req, res) => {
    let prod = productos.listarID(req.params.id)
    if (prod == 0) {
        res.json({ error: 'no se pudo eliminar el producto {ID Erroneo}' })
    } else {
        knex.from('productos').where('id', '=', req.params.id).del()
            .then(() => {
                console.log('producto eliminados')
            }).catch(error => {
                console.log('error:', error);
            });
        let eliminado = productos.eliminar(req.params.id)
        res.json(prod)
    }
};