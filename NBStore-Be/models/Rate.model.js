const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Tạo schema cho Rate
const rateSchema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  idProduct: {
    type: mongoose.Schema.Types.ObjectId, // Liên kết với bảng products
    ref: 'Product',
    required: true
  },
  idUser: {
    type: mongoose.Schema.Types.ObjectId, // Liên kết với bảng users
    ref: 'User',
    required: true
  },
  idOrderItem: {
    type: mongoose.Schema.Types.ObjectId, // Liên kết với bảng orderItems
    ref: 'OrderItem',
    required: true
  },
  star: {
    type: Number, // Đánh giá sao từ 1-5
    required: true
  },
  review: {
    type: String, // Nội dung đánh giá
    required: false
  },
  dateReview: {
    type: Date, // Ngày đánh giá
    default: Date.now
  }
}, { timestamps: true });

// Tạo model từ schema
const Rate = mongoose.model('Rate', rateSchema);

module.exports = Rate;
