const express = require('express');
const { check, body } = require('express-validator');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth')

const router = express.Router();

router.all('*', isAuth);

// /admin/add-product => GET
router.get('/add-product', adminController.getAddProduct);

// /admin/products => GET
router.get('/products', adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product',
    [
        body('title')
            .isString()
            .isLength({ min: 3 })
            .trim()
            .withMessage('Please enter a valid title'),
        body('price')
            .isFloat()
            .withMessage('Please enter a valid price'),
        body('description')
            .isLength({ min: 5, max: 200 })
            .trim()
            .withMessage('Please enter a valid description (more than 3 characters, less that 200)'),
    ],
    adminController.postAddProduct);

router.get('/edit-product/:productId', adminController.getEditProduct);

router.post('/edit-product',
    [
        body('title')
            .isString()
            .isLength({ min: 3 })
            .trim()
            .withMessage('Please enter a valid title'),
        body('price')
            .isFloat()
            .withMessage('Please enter a valid price'),
        body('description')
            .isLength({ min: 5, max: 200 })
            .trim()
            .withMessage('Please enter a valid description (more than 3 characters, less that 200)'),
    ],
    adminController.postEditProduct);

router.post('/delete-product', adminController.postDeleteProduct);

module.exports = router;
