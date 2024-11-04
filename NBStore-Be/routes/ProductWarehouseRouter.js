const express = require('express');
const bodyParser = require("body-parser");
const productWareHouseRouter = express.Router();
const {ProductWarehouse} = require('../controllers/index')
productWareHouseRouter.use(bodyParser.json());

productWareHouseRouter.get('/list', ProductWarehouse.getProductWarehouse);
productWareHouseRouter.post('/create',ProductWarehouse.createProductWarehouse);
productWareHouseRouter.get('/find',ProductWarehouse.checkProductInWarehouse);
productWareHouseRouter.get('/:id',ProductWarehouse.getProductWarehouseDetail);
productWareHouseRouter.put('/update/:id',ProductWarehouse.updateProductWarehouse);
productWareHouseRouter.delete('/delete/:id',ProductWarehouse.deleteProductWarehouse)

module.exports = {productWareHouseRouter}
