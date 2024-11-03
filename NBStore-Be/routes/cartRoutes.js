const express = require('express');
const { addToCart, updateCartItem, removeCartItem, getCart, getAll } = require('../controllers/cartController');
const authenticateToken = require('../middleware/auth.middleware');
const CartRouter = express.Router();

// Thêm sản phẩm vào giỏ hàng
CartRouter.post('/add', addToCart);

// Cập nhật số lượng sản phẩm trong giỏ hàng
CartRouter.put('/update', updateCartItem);

// Xóa sản phẩm khỏi giỏ hàng
CartRouter.delete('/remove/:cartItemId', removeCartItem);

// Lấy giỏ hàng của người dùng
CartRouter.get('/', getAll);

CartRouter.get('/item', getCart);

module.exports = CartRouter;
