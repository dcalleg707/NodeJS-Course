const fs = require('fs');
const path = require('path')
const Product = require("./product");

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
);


module.exports = class Cart {

    static addProduct(id, productPrice) {
        fs.readFile(p, (err, fileContent) => {
            let cart = { products: [], totalPrice: 0 };
            if (!err) {
                cart = JSON.parse(fileContent);
            }
            const existingProductIndex = cart.products.findIndex(p => p.id === id);
            const existingProduct = cart.products[existingProductIndex]
            let updatedProduct;
            if (existingProduct) {
                updatedProduct = { ...existingProduct };
                updatedProduct.qty = updatedProduct.qty + 1;
                cart.products[existingProductIndex] = updatedProduct;
            }
            else {
                updatedProduct = { id: id, qty: 1 };
                cart.products = [...cart.products, updatedProduct]
            }
            cart.totalPrice += parseFloat(productPrice);
            fs.writeFile(p, JSON.stringify(cart), (err) => {
                console.log(err);
            })
        });
    }

    static deleteProduct(id, productPrice) {
        fs.readFile(p, (err, content) => {
            if (err) {
                return
            }
            const cart = JSON.parse(content);
            const product = cart.products.find(product => product.id === id);
            if(!product) {
                return;
            }
            const productQty = product.qty;
            cart.products = cart.products.filter(prod => prod.id !== id)
            cart.totalPrice -= productPrice * productQty;
            fs.writeFile(p, JSON.stringify(cart), (err) => {
                console.log(err);
            })
        })
    }

    static getCart(cb) {
        fs.readFile(p, (err, content) => {
            if (err) {
                cb(null)
            }
            const cart = JSON.parse(content);
            cb(cart)
        })
    }

}