const express = require('express');
const { getAllProducts, productDetail } = require('../controllers/productController');

const ProductRoute = express.Router();

// Route to list all products
ProductRoute.get('/list', getAllProducts);

// Route to get a product by its ID
ProductRoute.get('/:id', productDetail);

module.exports = ProductRoute;