class Productos {
    constructor() {
        this.productos = []
    }
    guardar(producto) {
        producto.id = this.productos.length
        this.productos.push(producto)
        console.log(producto)
        return producto
    }
    listar() {
        if (this.productos.length == 0) {
            return 0
        } else {
            return this.productos
        }
    }
    listarID(id) {
        if (this.productos[id] != null) {
            return this.productos[id]
        } else {
            return 0
        }
    }

    actualizar(idProd, product) {
        let result = this.listarID(idProd)
        if (result == 0) {
            return 0
        } else {
            this.productos[idProd].title = product.title
            this.productos[idProd].price = product.price
            this.productos[idProd].thumbnail = product.thumbnail
            return this.productos[idProd]
        }
    }

    eliminar(idProd) {
        let result = this.listarID(idProd)
        if (result == 0) {
            return 0
        } else {
            delete this.productos[idProd]
            return result
        }
    }
}

// exporto una instancia de la clase
module.exports = new Productos();