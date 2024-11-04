const express = require("express");
const CategoryRouter = express.Router();
const bodyParser = require("body-parser");
const {CategoryController} = require("../controllers/index");
CategoryRouter.use(bodyParser.json());

// Route for creating a new category
CategoryRouter.post("/create", CategoryController.createCategory);

// Route for getting all categories
CategoryRouter.get("/", CategoryController.getAllCategories);

// Route for getting a single category by ID
CategoryRouter.get("find/:id", CategoryController.getCategoryById);

// Route for updating a category by ID
CategoryRouter.put("/update/:id", CategoryController.updateCategory);

// Route for deleting a category by ID
CategoryRouter.delete("/delete/:id", CategoryController.deleteCategory);

module.exports = CategoryRouter;