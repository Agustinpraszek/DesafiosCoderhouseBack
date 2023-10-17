const fs = require('fs');

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
        this.products = this._loadProductsFromFile();
        this.currentId = this.products.length > 0 ? this.products[this.products.length - 1].id + 1 : 1;
    }

    // Carga productos desde un archivo
    _loadProductsFromFile() {
        if (fs.existsSync(this.path)) {
            const fileContent = fs.readFileSync(this.path, 'utf-8');
            return JSON.parse(fileContent);
        }
        return [];
    }

    // Guarda la lista de productos en un archivo
    _saveProductsToFile() {
        fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2), 'utf-8');
    }

    // Agrega un producto a la lista y actualiza el archivo
    addProduct({ title, description, price, thumbnail, code, stock }) {
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
        this._saveProductsToFile();
    }

    // Devuelve la lista de productos
    getProducts() {
        return this.products;
    }

    // Busca y devuelve un producto por su ID
    getProductById(id) {
        const product = this.products.find(product => product.id === id);
        if (!product) {
            throw new Error("Producto no encontrado");
        }
        return product;
    }

    // Actualiza un producto por su ID y actualiza el archivo
    updateProduct(id, updatedProduct) {
        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex === -1) {
            throw new Error("Producto no encontrado");
        }

        const product = this.products[productIndex];
        this.products[productIndex] = { ...product, ...updatedProduct, id }; 
        this._saveProductsToFile();
    }

    // Elimina un producto por su ID y actualiza el archivo
    deleteProduct(id) {
        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex === -1) {
            throw new Error("Producto no encontrado");
        }

        this.products.splice(productIndex, 1);
        this._saveProductsToFile();
    }
}


const manager = new ProductManager('products.json');

// Añadir un producto
try {
    manager.addProduct({
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

// Muestra todos los productos
console.log(manager.getProducts());

// Obtiene el producto por su ID
try {
    const product = manager.getProductById(1);
    console.log("Producto obtenido por ID:", product);
} catch (error) {
    console.error(error.message);
}

// Actualiza el producto por su ID
try {
    manager.updateProduct(1, { title: "producto prueba actualizado" });
    console.log("Producto actualizado correctamente.");
} catch (error) {
    console.error(error.message);
}

// Muestra el producto después de actualizar
console.log("Producto después de actualizar:", manager.getProductById(1));

// Elimina el producto por su ID
try {
    manager.deleteProduct(1);
    console.log("Producto eliminado correctamente.");
} catch (error) {
    console.error(error.message);
}

// Mostrar la lista de productos después de eliminar
console.log(manager.getProducts());