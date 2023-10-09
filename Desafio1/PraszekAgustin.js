class ProductManager {
    constructor() {
        this.products = [];
        this.currentId = 1; // maneja el ID autoincrementable
    }

    addProduct({ title, description, price, thumbnail, code, stock }) {
        // Validar campos obligatorios
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            throw new Error("Todos los campos son obligatorios");
        }

        // Validar que no se repita el código
        const existingProduct = this.products.find(product => product.code === code);
        if (existingProduct) {
            throw new Error("Ya existe un producto con ese código");
        }

        // Agregar producto con ID autoincrementable
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
        this.currentId++; // Incrementar el ID para el próximo producto
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(product => product.id === id);
        if (!product) {
            console.error("Not Found");
            return null;
        }
        return product;
    }
}


const manager = new ProductManager();

console.log(manager.getProducts()); // Debería mostrar un arreglo vacío: []

try {
    manager.addProduct({
        title: "Cordon de zapatilla",
        description: "Cordon para zapatillas verdes",
        price: 200,
        thumbnail: "Sin imagen",
        code: "1158",
        stock: 28
    });
    console.log("Producto agregado correctamente.");
} catch (error) {
    console.error("Error al agregar producto:", error.message);
}

console.log(manager.getProducts()); // Debería mostrar el producto recién agregado

try {
    manager.addProduct({
        title: "Cordon de buzo",
        description: "Cordon para capucha blanco",
        price: 300,
        thumbnail: "Sin imagen",
        code: "1158",
        stock: 14
    });
    console.log("Producto agregado correctamente.");
} catch (error) {
    console.error("Error al agregar producto:", error.message); // Debería mostrar el error debido al código repetido
}

console.log(manager.getProductById(1)); // Debería mostrar el producto con ID 1
console.log(manager.getProductById(100)); // Debería mostrar "Not Found" y luego null