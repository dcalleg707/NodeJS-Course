const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');
const {get} = require('../routes/admin');
module.exports = class User {
  constructor(username, email, cart, id = null) {
    this.name = username;
    this.email = email;
    this.cart = cart;
    this._id = id ? new mongodb.ObjectId(id) : null;
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      dbOp = db.collection('users')
        .updateOne({_id: this._id}, {$set: this});
    }
    else {
      dbOp = db.collection('users')
        .insertOne(this)
    }

    return dbOp
      .then(result => console.log(result))
      .catch(err => console.log(err));
  }

  addToCart(product) {
    let newQuantity = 1;
    const db = getDb();

    const cartProductIndex = this.cart.items.findIndex(cp => {
      return cp.productId.toString() === product._id.toString()
    });
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({productId: new mongodb.ObjectId(product._id), quantity: newQuantity});
    }

    const updatedCart = {items: updatedCartItems};
    return db.collection('users').updateOne({_id: this._id}, {$set: {cart: updatedCart}});
  }


  getCart() {
    const db = getDb();
    const prodIds = this.cart.items.map(prod => new mongodb.ObjectId(prod.productId))
    return db.collection('products')
      .find({
        _id: {
          $in: prodIds
        }
      })
      .toArray()
      .then(products => {
        return products.map(p => (
          {
            ...p,
            quantity: this.cart.items.find(i => {
              return i.productId.toString() === p._id.toString()
            }).quantity
          }))
      })
  }

  deleteItemFromCart(productId) {
    const db = getDb();
    const updatedCartItems = this.cart.items.filter(p => p.productId.toString() !== productId);
    return db.collection('users')
      .updateOne({_id: this._id}, {
        $set:
          {cart: {items: updatedCartItems}}
      });
  }

  addOrder() {
    const db = getDb();
    return this.getCart()
      .then(products => {
        const order = {
          items: products,
          user: {
            _id: this._id,
            name: this.name,
          }
        };
        return db.collection('orders').insertOne(order);
      })
      .then(result => {
        this.cart = {items: []}
        return db.collection('users')
          .updateOne({_id: this._id}, {
            $set:
              {cart: {items: []}}
          });
      })
      .catch(err => console.log(err))
  }

  getOrders() {
    const db = getDb();
    return db.collection('orders').find({'user._id': this._id}).toArray();
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection('users')
      .findOne({_id: new mongodb.ObjectId(userId)})
      .then(user => {
        console.log(user)
        return user
      })
      .catch(err => console.log(err));
  }
};