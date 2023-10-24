const express = require('express');
const ProductManager = require('./ProductManager');
const app = express();
const PORT = 8080;

const productManager = new ProductManager('products.json');

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

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

app.get('/', (_, res) => {
    res.redirect('/products');
});