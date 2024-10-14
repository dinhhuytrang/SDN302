const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Tạo schema cho Rate
const rateSchema = new Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId, // Liên kết với bảng products
    ref: 'Product',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId, // Liên kết với bảng users
    ref: 'User',
  },
  orderItem: {
    type: mongoose.Schema.Types.ObjectId, // Liên kết với bảng orderItems
    ref: 'OrderItem',
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
