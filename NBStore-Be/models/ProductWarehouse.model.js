const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Tạo schema cho ProductWarehouse
const productWarehouseSchema = new Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId, // Liên kết với bảng products
    ref: 'Product',
    required: true
  },
  status: {
    type: String, // Trạng thái nhập hoặc xuất kho
    enum: ['In', 'Out'], // Chỉ định các giá trị "In" hoặc "Out"
    required: true
  },
  quantity: {
    type: Number, // Số lượng sản phẩm được nhập/xuất
    required: true
  },
  date: {
    type: Date, // Ngày nhập/xuất kho
    default: Date.now
  }
}, { timestamps: true });

// Tạo model từ schema
const ProductWarehouse = mongoose.model('ProductWarehouse', productWarehouseSchema);

module.exports = ProductWarehouse;
