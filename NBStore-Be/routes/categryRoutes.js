const express = require('express');
const bodyParser = require("body-parser");
const {CategoryController} = require("../controllers");

const CategoryRouter = express.Router();
CategoryRouter.use(bodyParser.json());

CategoryRouter.get('/', CategoryController.getFeaturedCategories)

module.exports = {
    CategoryRouter,
}