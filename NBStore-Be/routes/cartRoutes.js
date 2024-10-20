const express = require('express');
const { addToCart, updateCartItem, removeCartItem, getCart } = require('../controllers/cartController');
const authenticateToken = require('../middleware/auth.middleware');
const CartRouter = express.Router();

// Thêm sản phẩm vào giỏ hàng
CartRouter.post('/add', authenticateToken, addToCart);

// Cập nhật số lượng sản phẩm trong giỏ hàng
CartRouter.put('/update', authenticateToken, updateCartItem);

// Xóa sản phẩm khỏi giỏ hàng
CartRouter.delete('/remove/:cartItemId', authenticateToken, removeCartItem);

// Lấy giỏ hàng của người dùng
CartRouter.get('/', authenticateToken, getCart);

module.exports = CartRouter;
