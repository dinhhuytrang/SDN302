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
// Get a product by ID
const getProductByID = async (req, res, next) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId).populate("category").exec(); //2
        if (product) {
            res.status(200).json({
                message: `Product with id ${product.id}`,
                data: product
            });
        } else {
            res.status(404).json({
                message: "Product not found"
            });
        }
    } catch (error) {
        next(error); // Pass the error to the next middleware
    }
};
// get product recommendations
const getRecommendedProducts = async (req, res, next) => {
    try {
        const productId = req.params.id;
        
        // Find the current product by ID
        const currentProduct = await Product.findById(productId).populate("category").exec(); //1
        // res.status(200).json(currentProduct);
        if (currentProduct) {
            // Find other products in the same category excluding the current product
            const recommendedProducts = await Product.find({
                category: currentProduct.category, // Same category
                _id: { $ne: productId } // Exclude the current product
            }).populate("category").limit(4).exec();

            if (recommendedProducts.length > 0) {
                res.status(200).json({
                    message: `Recommended products for product ID: ${productId}`,
                    data: recommendedProducts
                });
            } else {
                res.status(404).json({
                    message: "No recommended products found"
                });
            }
        } else {
            res.status(404).json({
                message: "Product not found"
            });
        }
    } catch (error) {
        next(error); 
    }
};
module.exports = { getProducts,getProductByID,getRecommendedProducts };
