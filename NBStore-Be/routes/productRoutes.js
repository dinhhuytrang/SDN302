const express = require('express');
const bodyParser = require("body-parser");
const ProductRouter = express.Router();
const {getProducts} = require("../controllers/productController");
const {productController} = require("../controllers")
ProductRouter.use(bodyParser.json());

ProductRouter.get('/', getProducts);
ProductRouter.get('/search', productController.searchProducts);
ProductRouter.get('/features', productController.getTopSellingProducts);
ProductRouter.get('/:id',productController.getProductByID);
ProductRouter.get('/:id/recommendations',productController.getRecommendedProducts);


module.exports = {
    ProductRouter
}