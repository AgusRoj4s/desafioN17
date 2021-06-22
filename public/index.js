const form = document.querySelector('#action');
const titleInput = document.querySelector('nombre');
const priceInput = document.querySelector('precio');
const thumbnailInput = document.querySelector('foto');

const socket = io.connect();

const productTemplate = Handlebars.compile(`
    <div class="jumbotron">
    <h1>Vista de Productos</h1>
    {{#if hayProductos}} 
        <div class="table-responsive">
            <table class="table table-dark">
                <tr> <th>Nombre</th> <th>Precio</th> <th>Foto</th></tr>
                {{#each prod}}
                    <tr> <td>{{this.title}}</td> <td>{{this.price}}</td> <td><img width="50" src={{this.thumbnail}} alt="not found"></td> </tr>
                {{/each}}
            </table>
        </div>
    {{else}}  
        <h3 class="alert alert-warning">No se encontraron productos</h3>
    {{/if}}
    </div>
`);

function renderProducts(prod = []) {
    const html = productTemplate({ prod, hayProductos: !!prod.length });
    return html;
}

socket.on('lista', (data) => {
    let final = renderProducts(data);
    document.getElementById('datos').innerHTML = final;
})

form.addEventListener('submit', event => {
    event.preventDefault();
    const title = titleInput.value;
    const price = priceInput.value;
    const thumbnail = thumbnailInput.value;
    socket.emit('productAdd', { title, price, thumbnail });
    form.reset();
})