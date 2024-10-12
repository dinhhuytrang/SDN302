const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Tạo schema cho Cart
const cartSchema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  idUser: {
    type: mongoose.Schema.Types.ObjectId, // Liên kết với bảng users
    ref: 'User',
    required: true
  },
  idProduct: {
    type: mongoose.Schema.Types.ObjectId, // Liên kết với bảng products
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number, // Số lượng sản phẩm trong giỏ hàng
    required: true
  }
}, { timestamps: true });

// Tạo model từ schema
const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
