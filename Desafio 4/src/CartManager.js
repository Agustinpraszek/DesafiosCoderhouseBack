const fs = require('fs').promises;
const path = require('path');

class CartManager {
    constructor() {
        this.carts = [];
        this.cartFilePath = path.join(__dirname, '..', 'carts.json');
        this._loadCartsFromFile();
    }

    async _loadCartsFromFile() {
        try {
            const data = await fs.readFile(this.cartFilePath, 'utf-8');
            this.carts = JSON.parse(data);
        } catch (error) {
            console.error("Error loading carts from file:", error);
        }
    }

    async _saveCartsToFile() {
        try {
            await fs.writeFile(this.cartFilePath, JSON.stringify(this.carts, null, 2));
        } catch (error) {
            console.error("Error saving carts to file:", error);
        }
    }

    async createCart() {
        const newCart = {
            id: Date.now(),
            products: []
        };
        this.carts.push(newCart);
        await this._saveCartsToFile();
        return newCart;
    }

    getCartById(cartId) {
        return this.carts.find(cart => cart.id === cartId);
    }

    async addProductToCart(cartId, productId) {
        const cart = this.getCartById(cartId);
        if (!cart) {
            throw new Error("Cart not found");
        }

        const productInCart = cart.products.find(p => p.product === productId);
        if (productInCart) {
            productInCart.quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        await this._saveCartsToFile();
    }

}

module.exports = new CartManager();