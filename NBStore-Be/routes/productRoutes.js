const express = require('express');
const bodyParser = require("body-parser");
const ProductRouter = express.Router();
const {getProducts} = require("../controllers/productController");
const {productController} = require("../controllers")
ProductRouter.use(bodyParser.json());

ProductRouter.get('/', getProducts);

ProductRouter.get('/:id',productController.getProductByID)
ProductRouter.get('/:id/recommendations',productController.getRecommendedProducts)
ProductRouter.post('/create',productController.createNewProduct)
ProductRouter.get('/search', productController.searchProducts);
ProductRouter.get('/:id',productController.getProductByID);
ProductRouter.put('/update/:productId', productController.updateProduct);
ProductRouter.delete('/remove/:productId', productController.deleteProduct);

module.exports = {
    ProductRouter
}