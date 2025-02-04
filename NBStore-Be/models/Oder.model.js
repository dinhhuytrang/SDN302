const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Tạo schema cho Order
const orderSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, // Liên kết với bảng users
    ref: 'User',
    required: true
  },
  totalOrder: {
    type: Number, // Tổng giá trị đơn hàng
    required: true
  },
  status: {
    type: String, // Trạng thái đơn hàng (ví dụ: "Pending", "Shipped", "Delivered")
    required: true
  },
  sale: {
    type: Number,
    default: 0
  },
  createDate: {
    type: Date, // Ngày tạo đơn hàng
    default: Date.now
  },
  payMethod: {
    type: String, // Phương thức thanh toán (ví dụ: "vnpay", "cod")
    required: true
  },
  orderCode: {
    type: String, // Mã đơn hàng
    required: true,
    unique: true
  },
  address: {
    type: String, // Địa chỉ giao hàng
    required: true
  },
  phone: {
    type: String, // Số điện thoại liên hệ
    required: true
  },
  sale: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Tạo model từ schema
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
