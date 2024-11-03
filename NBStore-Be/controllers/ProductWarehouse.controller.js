const ProductWarehouse = require('../models/ProductWarehouse.model');
const Product = require('../models/Products.model')
const mongoose = require('mongoose');
const getProductWarehouse = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 10; 
        const skip = (page - 1) * limit;
        const ListProductWare = await ProductWarehouse.find()
            .populate('product')
            .skip(skip)
            .limit(limit)
            .exec();
        const totalCount = await ProductWarehouse.countDocuments();

        if (ListProductWare && ListProductWare.length > 0) {
            res.status(200).json({
                message: "List of product warehouse",
                data: ListProductWare,
                pagination: {
                    totalItems: totalCount,
                    totalPages: Math.ceil(totalCount / limit),
                    currentPage: page,
                }
            });
        } else {
            res.status(404).json({
                message: "Not found product warehouse"
            });
        }
    } catch (error) {
        next(error);
    }
};

// View Details
const getProductWarehouseDetail = async (req, res, next) => {
    try {
        const { id } = req.params; // Get the ID from the request parameters
        const productWarehouse = await ProductWarehouse.findById(id)
            .populate('product')
            .exec();

        if (productWarehouse) {
            res.status(200).json({
                message: "Product warehouse details retrieved successfully",
                data: productWarehouse,
            });
        } else {
            res.status(404).json({
                message: "Product warehouse not found",
            });
        }
    } catch (error) {
        next(error);
    }
};

// create a new ProductWarehouse

// Tạo mới ProductWarehouse với kiểm tra sản phẩm
// const createProductWarehouse = async (req, res, next) => {
//     try {
//         const { product, status, quantity, supplier, note } = req.body;

//         // Find the product by name to get its ObjectId
//         const existingProduct = await Product.findOne({ name: product }); 

//         if (!existingProduct) {
//             return res.status(400).json({ message: "Product not found" });
//         }

//         // Create the ProductWarehouse entry using the product's ObjectId
//         const productWarehouse = new ProductWarehouse({
//             product: existingProduct._id,
//             status,
//             quantity,
//             supplier,
//             note
//         });

//         const savedProductWarehouse = await productWarehouse.save();
//         res.status(201).json({
//             message: "Product warehouse created successfully",
//             data: savedProductWarehouse
//         });
//     } catch (error) {
//         next(error);
//     }
// };
const createProductWarehouse = async (req, res, next) => {
    try {
        const { product, status, quantity, supplier, note } = req.body;

        // Check if product is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(product)) {
            return res.status(400).json({ message: "Invalid product ID format" });
        }

        // Find the product by ID to confirm it exists
        const existingProduct = await Product.findById(product);

        if (!existingProduct) {
            return res.status(400).json({ message: "Product not found" });
        }

        // Create the ProductWarehouse entry using the valid product ObjectId
        const productWarehouse = new ProductWarehouse({
            product: existingProduct._id,
            status,
            quantity,
            supplier,
            note
        });

        const savedProductWarehouse = await productWarehouse.save();
        res.status(201).json({
            message: "Product warehouse created successfully",
            data: savedProductWarehouse
        });
    } catch (error) {
        next(error);
    }
};


// update a ProductWarehouse

const updateProductWarehouse = async (req, res, next) => {
    try {
        const productId = req.params.id;
        const updatedProductWarehouse = await ProductWarehouse.findByIdAndUpdate(productId, req.body, { new: true });
        if (updatedProductWarehouse) {
            res.status(200).json({
                message: "Product warehouse updated successfully",
                data: updatedProductWarehouse
            });
        } else {
            res.status(404).json({
                message: "Product warehouse not found"
            });
        }
    } catch (error) {
        next(error);
    }
};

// delete a ProductWarehouse

const deleteProductWarehouse = async (req, res, next) => {
    try {
        const productId = req.params.id;
        const deletedProductWarehouse = await ProductWarehouse.findByIdAndDelete(productId);
        if (deletedProductWarehouse) {
            res.status(200).json({
                message: "Product warehouse deleted successfully"
            });
        } else {
            res.status(404).json({
                message: "Product warehouse not found"
            });
        }
    } catch (error) {
        next(error);
    }
};
// check product in warehouse 
const checkProductInWarehouse = async (req, res, next) => {
    try {
        const { productName } = req.query; // Get product name from query params

        // Find the product by name to get its ObjectId
        const existingProduct = await Product.findOne({ name: productName });

        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Check if the product exists in the ProductWarehouse
        const productInWarehouse = await ProductWarehouse.findOne({ product: existingProduct._id });

        if (productInWarehouse) {
            res.status(200).json({
                message: "Product exists in the warehouse",
                data: productInWarehouse
            });
        } else {
            res.status(404).json({
                message: "Product not found in the warehouse"
            });
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {getProductWarehouse,createProductWarehouse,deleteProductWarehouse,updateProductWarehouse,checkProductInWarehouse,getProductWarehouseDetail};