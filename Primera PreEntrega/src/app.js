const express = require('express');
const ProductManager = require('./ProductManager');
const cartManager = require('./CartManager');
const app = express();
const PORT = 8080;
const productManager = new ProductManager('products.json');

app.use(express.json());

app.get('/products', async (req, res) => {
    const limit = parseInt(req.query.limit);
    const productManager = new ProductManager('products.json');

    try {
        const products = await productManager.getAllProducts(limit);
        res.json({ products });
    } catch (error) {
        res.status(500).send("Error al obtener productos");
    }
});


app.get('/products/:pid', async (req, res) => {
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

app.get('/carts/:cid', (req, res) => {
    const cartId = parseInt(req.params.cid);
    const cart = cartManager.getCartById(cartId);
    if (!cart) {
        return res.status(404).send("Carrito no encontrado");
    }
    res.send(cart.products);
});

// Agregar un nuevo producto
app.post('/products', async (req, res) => {
    try {
        await productManager.addProduct(req.body);
        res.status(201).send("Producto agregado correctamente");
    } catch (error) {
        res.status(500).send(`Error al agregar producto: ${error.message}`);
    }
});

app.post('/carts', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).send(newCart);
    } catch (error) {
        res.status(500).send(`Error al crear el carrito: ${error.message}`);
    }
});

app.post('/carts/:cid/product/:pid', async (req, res) => {
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
app.put('/products/:pid', async (req, res) => {
    try {
        await productManager.updateProduct(parseInt(req.params.pid), req.body);
        res.send("Producto actualizado correctamente");
    } catch (error) {
        res.status(500).send(`Error al actualizar producto: ${error.message}`);
    }
});

// Eliminar un producto
app.delete('/products/:pid', async (req, res) => {
    try {
        await productManager.deleteProduct(parseInt(req.params.pid));
        res.send("Producto eliminado correctamente");
    } catch (error) {
        res.status(500).send(`Error al eliminar producto: ${error.message}`);
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

app.get('/', (_, res) => {
    res.redirect('/products');
});