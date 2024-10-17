const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Tạo schema cho Product
const productSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    type: [String], // Mảng các link ảnh
    required: false
  },
  price: {
    type: Number,
    required: true
  },
  remain: {
    type: Number, // Số lượng còn lại
    required: true
  },
  numberOfSale: {
    type: Number, // Số lượng đã bán
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId, // Liên kết tới bảng categories
    ref: 'category',
    required: true
  },
  description: {
    type: String,
    required: false
  },
  option: {
    type: [String],
    required: false
  },
  rate: [{
    type: mongoose.Schema.Types.ObjectId, // Reference to the Rate model
    ref: 'Rate',
    required: false
  }]
}, { timestamps: true });

// Tạo model từ schema
const Product = mongoose.model('Product', productSchema);

module.exports = Product;

