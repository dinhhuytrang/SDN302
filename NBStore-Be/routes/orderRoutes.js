const express = require('express');
const bodyParser = require("body-parser");
const { OrderController } = require('../controllers');
const OrderRouter = express.Router();
OrderRouter.use(bodyParser.json());

OrderRouter.get('/', OrderController.getAllOrderOfUser)
    .get('/orderItems', OrderController.getAllItemOrderOfUser)
module.exports = {
    OrderRouter
}