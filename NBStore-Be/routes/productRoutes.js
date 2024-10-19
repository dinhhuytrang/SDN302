const express = require('express');
const bodyParser = require("body-parser");
const ProductRouter = express.Router();
const {getProducts} = require("../controllers/productController");

ProductRouter.use(bodyParser.json());

ProductRouter.get('/', getProducts);

module.exports = {
    ProductRouter,
}