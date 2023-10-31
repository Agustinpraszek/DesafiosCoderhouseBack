const fsPromises = require('fs').promises;
class ProductManager {
    constructor(filePath) {
        this.path = filePath;
        this.products = [];
        this._loadProductsFromFile().then(products => {
            this.products = products;
            this.currentId = this.products.length > 0 ? this.products[this.products.length - 1].id + 1 : 1;
        });
    }

    // Carga productos desde un archivo
    async _loadProductsFromFile() {
        try {
            await fsPromises.access(this.path, fsPromises.constants.R_OK); // Solo verifica la lectura
            const fileContent = await fsPromises.readFile(this.path, 'utf-8');
            return JSON.parse(fileContent);
        } catch (error) {
            console.error('Error loading products:', error.message);
            return [];
        }
    }

    // Guarda la lista de productos en un archivo
    async _saveProductsToFile() {
        try {
            await fsPromises.writeFile(this.path, JSON.stringify(this.products, null, 2), 'utf-8');
        } catch (error) {
            console.error('Error saving products:', error.message);
        }
    }

    // Agrega un producto a la lista y actualiza el archivo
    async addProduct({ title, description, price, thumbnail, code, stock }) {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            throw new Error("Todos los campos son obligatorios");
        }

        const existingProduct = this.products.find(product => product.code === code);
        if (existingProduct) {
            throw new Error("Ya existe un producto con ese código");
        }

        const newProduct = {
            id: this.currentId,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        };
        this.products.push(newProduct);
        this.currentId++;

        await this._saveProductsToFile();
    }

    // Devuelve la lista de productos
    getProducts() {
        return this.products;
    }

    // Busca y devuelve un producto por su ID
    async getProductById(id) {
        const product = this.products.find(product => product.id === id);
        if (!product) {
            throw new Error("Producto no encontrado");
        }
        return product;
    }

    // Actualiza un producto por su ID y actualiza el archivo
      async updateProduct(id, updatedProduct) {
        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex === -1) {
            throw new Error("Producto no encontrado");
        }

        const product = this.products[productIndex];
        this.products[productIndex] = { ...product, ...updatedProduct, id }; 
        await this._saveProductsToFile();
    }

    // Elimina un producto por su ID y actualiza el archivo
    async deleteProduct(id) {
        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex === -1) {
            throw new Error("Producto no encontrado");
        }

        this.products.splice(productIndex, 1);
        await this._saveProductsToFile();
    }

    async initialize() {
        this.products = await this._loadProductsFromFile();
        this.currentId = this.products.length > 0 ? this.products[this.products.length - 1].id + 1 : 1;
    }

    async getAllProducts(limit) {
        const products = await this._loadProductsFromFile();
        if (limit && typeof limit === 'number') {
            return products.slice(0, limit);
        }
        return products;
    }
}

module.exports = ProductManager;

// Añadir un producto
(async () => {
    const manager = new ProductManager('products.json'); // Crear una instancia aquí
    await manager.initialize();

    try {
        await manager.addProduct({
            title: "Llavero Gojo",
            description: "Llavero para llevar todas tus llaves con figura divertida de jujutsu Kaisen",
            price: 2000,
            thumbnail: "Sin imagen",
            code: "st255",
            stock: 133
        });
        console.log("Producto agregado correctamente.");
    } catch (error) {
        console.error(error.message);
    }
    try {
        await manager.addProduct({
            title: "Llavero Denji",
            description: "Llavero para llevar todas tus llaves con figura divertida de Chainsawman",
            price: 2000,
            thumbnail: "Sin imagen",
            code: "st257",
            stock: 52
        });
        console.log("Producto agregado correctamente.");
    } catch (error) {
        console.error(error.message);
    }
    try {
        await manager.addProduct({
            title: "Llavero Megumi",
            description: "Llavero para llevar todas tus llaves con figura divertida de jujutsu Kaisen",
            price: 2000,
            thumbnail: "Sin imagen",
            code: "st256",
            stock: 17
        });
        console.log("Producto agregado correctamente.");
    } catch (error) {
        console.error(error.message);
    }
    try {
        await manager.addProduct({
            title: "Llavero Spiderman",
            description: "Llavero para llevar todas tus llaves con figura divertida de Marvel",
            price: 2000,
            thumbnail: "Sin imagen",
            code: "st225",
            stock: 2
        });
        console.log("Producto agregado correctamente.");
    } catch (error) {
        console.error(error.message);
    }
    try {
        await manager.addProduct({
            title: "Llavero Deadpool",
            description: "Llavero para llevar todas tus llaves con figura divertida de Marvel",
            price: 2000,
            thumbnail: "Sin imagen",
            code: "st224",
            stock: 550
        });
        console.log("Producto agregado correctamente.");
    } catch (error) {
        console.error(error.message);
    }
    try {
        await manager.addProduct({
            title: "Llavero 2D",
            description: "Llavero para llevar todas tus llaves con figura divertida de Gorillaz",
            price: 2000,
            thumbnail: "Sin imagen",
            code: "st320",
            stock: 5
        });
        console.log("Producto agregado correctamente.");
    } catch (error) {
        console.error(error.message);
    }
    try {
        await manager.addProduct({
            title: "Llavero Noodle",
            description: "Llavero para llevar todas tus llaves con figura divertida de Gorillaz",
            price: 2000,
            thumbnail: "Sin imagen",
            code: "st323",
            stock: 47
        });
        console.log("Producto agregado correctamente.");
    } catch (error) {
        console.error(error.message);
    }
    try {
        await manager.addProduct({
            title: "Llavero Jerry",
            description: "Llavero para llevar todas tus llaves con figura divertida de Tom & Jerry",
            price: 2000,
            thumbnail: "Sin imagen",
            code: "st205",
            stock: 98
        });
        console.log("Producto agregado correctamente.");
    } catch (error) {
        console.error(error.message);
    }
    try {
        await manager.addProduct({
            title: "Llavero Tom",
            description: "Llavero para llevar todas tus llaves con figura divertida de Tom & Jerry",
            price: 2000,
            thumbnail: "Sin imagen",
            code: "st204",
            stock: 27
        });
        console.log("Producto agregado correctamente.");
    } catch (error) {
        console.error(error.message);
    }
    try {
        await manager.addProduct({
            title: "Llavero Batman",
            description: "Llavero para llevar todas tus llaves con figura divertida de DC",
            price: 2000,
            thumbnail: "Sin imagen",
            code: "st200",
            stock: 1
        });
        console.log("Producto agregado correctamente.");
    } catch (error) {
        console.error(error.message);
    }
})();
