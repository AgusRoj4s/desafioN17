const productos = require('../api/productos');
exports.getProducts = (req, res) => {
    let prod = productos.listar()
    if (prod == 0) {
        res.json({ error: 'no hay productos cargados' })
    } else {
        res.json(prod)
    }
};

exports.getOneProduct = (req, res) => {
    let prod = productos.listarID(req.params.id)
    if (prod == 0) {
        res.json({ error: 'producto no encontrado' })
    } else {
        res.json(prod)
    }
};

exports.saveProduct = (req, res) => {
    let prod = productos.guardar(req.body)
    console.log('elemento guardado')
    res.json(prod)
};

exports.updateProduct = (req, res) => {
    let prod = productos.actualizar(req.params.id, req.body)
    if (prod == 0) {
        res.json({ error: 'no se pudo actualizar el producto {ID Erroneo}' })
    } else {
        console.log('elemento actualizado')
        res.json(prod)
    }
};

exports.deleteProduct = (req, res) => {
    let prod = productos.eliminar(req.params.id)
    if (prod == 0) {
        res.json({ error: 'no se pudo eliminar el producto {ID Erroneo}' })
    } else {
        console.log('elemento eliminado')
        res.json(prod)
    }
};