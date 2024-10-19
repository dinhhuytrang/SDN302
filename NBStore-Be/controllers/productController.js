const Product = require('../models/Products.model');

const getProducts = async (req, res,next) => {
    try {
        const products = await Product.find().populate("category").exec(); //1 
        if(products && products.length > 0) {
            res.status(200).json({
                message: "List of products",
                data: products
            })
        } else {
            res.status(404).json({
                message: "Products not found"
            });
        }
    } catch (error) {
        // res.status(500).json({ message: error.message });
        next(error)
    }
};

module.exports = { getProducts };
