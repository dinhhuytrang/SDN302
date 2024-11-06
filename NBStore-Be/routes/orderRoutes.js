const express = require('express');
const bodyParser = require("body-parser");
const { OrderController } = require('../controllers');
const OrderRouter = express.Router();
OrderRouter.use(bodyParser.json());

OrderRouter.get('/', OrderController.getAllOrderOfUser)
OrderRouter.get('/admin', OrderController.adminGetAllOrder)
OrderRouter.get('/admin/items', OrderController.getAllOrderItem)

OrderRouter.get('/orderItems', OrderController.getAllItemOrderOfUser)
OrderRouter.get("/getOrderInfo/:idOrder", OrderController.getOrderInfo)
OrderRouter.get("/getItemOfOrder/:idOrder", OrderController.getItemOfOrder)

OrderRouter.post('/changeStatus', OrderController.changeStatus)

module.exports = {
    OrderRouter
}