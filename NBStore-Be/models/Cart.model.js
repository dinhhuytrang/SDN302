const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Tạo schema cho Cart
const cartSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, // Liên kết với bảng users
    ref: 'User',
    required: false
  },
  product: {
    type: mongoose.Schema.Types.ObjectId, // Liên kết với bảng products
    ref: 'Product',
    required: false
  },
  quantity: {
    type: Number, // Số lượng sản phẩm trong giỏ hàng
    required: false
  }
}, { timestamps: true });

// Tạo model từ schema
const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
