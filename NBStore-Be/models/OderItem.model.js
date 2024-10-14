const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Tạo schema cho OrderItem
const orderItemSchema = new Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId, // Liên kết với bảng orders
    ref: 'Order',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId, // Liên kết với bảng products
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number, // Số lượng sản phẩm trong đơn hàng
    required: true
  }
}, { timestamps: true });

// Tạo model từ schema
const OrderItem = mongoose.model('OrderItem', orderItemSchema);

module.exports = OrderItem;
