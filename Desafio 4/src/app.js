const express = require('express');
const { engine } = require ('express-handlebars')
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const ProductManager = require('./ProductManager');
const cartManager = require('./CartManager');

const app = express();
const PORT = process.env.PORT || 8080;

const productManager = new ProductManager('products.json');

app.use(express.json());
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '../views'));

const server = http.createServer(app); 
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('Un cliente se ha conectado');

    socket.on('addProduct', async (data) => {
        try {
            const newProduct = await productManager.addProduct(data);
            io.emit('productAdded', newProduct);
        } catch (error) {
            console.error(error);
        }
    });

});

app.get('/api/products', async (req, res) => {
    const limit = parseInt(req.query.limit);
    const productManager = new ProductManager('products.json');

    try {
        const products = await productManager.getAllProducts(limit);
        res.json({ products });
    } catch (error) {
        res.status(500).send("Error al obtener productos");
    }
});

app.get('/api/products/:pid', async (req, res) => {
    console.log("Intentando obtener el producto con ID:", req.params.pid);
    const productId = parseInt(req.params.pid); 

    try {
        console.log("Antes de obtener el producto...");
        const product = await productManager.getProductById(productId);
        console.log("Producto obtenido:", product);
        if (product) {
            res.json(product);
        } else {
            res.status(404).send("Producto no encontrado");
        }
    } catch (error) {
        console.error("Error al obtener el producto:", error.message);
        res.status(500).send(`Error al obtener producto: ${error.message}`);
    }
});

app.get('/', async (req, res) => {
    try {
        const products = await productManager.getAllProducts();
        res.render('home', { products, title: 'Home' });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al obtener los productos");
    }
});

app.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productManager.getAllProducts();
        res.render('realTimeProducts', { products });
    } catch (error) {
        res.status(500).send("Error al obtener los productos");
    }
});

app.get('/api/carts/:cid', (req, res) => {
    const cartId = parseInt(req.params.cid);
    const cart = cartManager.getCartById(cartId);
    if (!cart) {
        return res.status(404).send("Carrito no encontrado");
    }
    res.send(cart.products);
});

// Agregar un nuevo producto
app.post('/api/products', async (req, res) => {
    try {
        const product = await productManager.addProduct(req.body);
        io.emit('productAdded', product); // Emitir a todos los clientes
        res.status(201).send("Producto agregado correctamente");
    } catch (error) {
        res.status(500).send(`Error al agregar producto: ${error.message}`);
    }
});

app.post('/api/carts', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).send(newCart);
    } catch (error) {
        res.status(500).send(`Error al crear el carrito: ${error.message}`);
    }
});

app.post('/api/carts/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);
        await cartManager.addProductToCart(cartId, productId);
        res.send("Producto agregado al carrito");
    } catch (error) {
        res.status(500).send(`Error al agregar producto al carrito: ${error.message}`);
    }
});

// Actualizar un producto
app.put('/api/products/:pid', async (req, res) => {
    try {
        await productManager.updateProduct(parseInt(req.params.pid), req.body);
        res.send("Producto actualizado correctamente");
    } catch (error) {
        res.status(500).send(`Error al actualizar producto: ${error.message}`);
    }
});

// Eliminar un producto
app.delete('/api/products/:pid', async (req, res) => {
    try {
        await productManager.deleteProduct(parseInt(req.params.pid));
        io.emit('productDeleted', req.params.pid); // Emitir a todos los clientes
        res.send("Producto eliminado correctamente");
    } catch (error) {
        res.status(500).send(`Error al eliminar producto: ${error.message}`);
    }
});

server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });

app.get('/', (_, res) => {
    res.redirect('/api/products');
});
