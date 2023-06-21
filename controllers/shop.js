const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
  Product
    .find()
    .then((products) => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  console.log(prodId)
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail',
        {
          product: product,
          pageTitle: 'details',
          path: '/products'
        }
      )
    }).catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then(user => {
      const products = user.cart.items;
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
      });
    })
    .catch(err => console.log(err))

  // Cart.getCart(cart => {
  //   Product.fetchAll(products => {
  //     const cartProducts = []
  //     for (product of products) {
  //       const cartProductData = cart.products.find(prod => prod.id === product.id);
  //       if (cartProductData) {
  //         cartProducts.push({productData: product, qty: cartProductData.qty})
  //       }
  //     }
  //     res.render('shop/cart', {
  //       path: '/cart',
  //       pageTitle: 'Your Cart',
  //       products: cartProducts
  //     });
  //   })
  // })
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(() => res.redirect('cart'))
    .catch()

  //   let fetchedCart;
  //   let newQuantity = 1;
  //   req.user
  //     .getCart()
  //     .then(cart => {
  //       fetchedCart = cart;
  //       return cart.getProducts({where: {id: prodId}})
  //     })
  //     .then(products => {
  //       let product
  //       if (products.length > 0) {
  //         product = products[0]
  //         const oldQuantity = product.cartItem.quantity;
  //         newQuantity = oldQuantity + 1;
  //         return product;
  //       }
  //       return Product.findByPk(prodId)
  //     })
  //     .then(product => {
  //       return fetchedCart.addProduct(product, {
  //         through: {
  //           quantity: newQuantity
  //         }
  //       });
  //     })
  //     .then(() => res.redirect('cart'))
  //     .catch()
}

exports.postCartDeletProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.removeFromCart(prodId)
    .then(() => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err))
}

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then(user => {
      const products = user.cart.items.map(prod => ({
        quantity: prod.quantity,
        product: { ...prod.productId._doc }
      }));
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user
        },
        products: products
      });
      return order.save();
    })
    .then(() => {
      return req.user.clearCart()
    })
    .then(() => {
      res.redirect('/orders')
    })
    .catch(err => console.log(err))
}

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders
      });
    })
    .catch(err => console.log(err))
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
