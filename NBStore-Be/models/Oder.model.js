const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Tạo schema cho Order
const orderSchema = new Schema({
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
  totalOrder: {
    type: Number, // Tổng giá trị đơn hàng
    required: true
  },
  status: {
    type: String, // Trạng thái đơn hàng (ví dụ: "Pending", "Shipped", "Delivered")
    required: true
  },
  createDate: {
    type: Date, // Ngày tạo đơn hàng
    default: Date.now
  },
  payMethod: {
    type: String, // Phương thức thanh toán (ví dụ: "Credit Card", "Cash on Delivery")
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
  }
}, { timestamps: true });

// Tạo model từ schema
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
