const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Tạo schema cho Product
const productSchema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
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
  idCategory: {
    type: mongoose.Schema.Types.ObjectId, // Liên kết tới bảng categories
    ref: 'Category',
    required: true
  },
  description: {
    type: String,
    required: false
  },
  option: {
    type: [String], 
    required: false
  }
}, { timestamps: true });

// Tạo model từ schema
const Product = mongoose.model('Product', productSchema);

module.exports = Product;

