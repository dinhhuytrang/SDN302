const Product = require('../models/Products.model');

const getProducts = async (req, res, next) => {
    try {
        const products = await Product.find().populate("category").exec(); //1 
        if (products && products.length > 0) {
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

const createNewProduct = async (req, res, next) => {
    try {

        if (typeof req.body.image === 'string') {
            try {

                req.body.image = JSON.parse(req.body.image);
            } catch (error) {
                return res.status(400).json({ message: 'Invalid image format' });
            }
        }


        if (!Array.isArray(req.body.image)) {
            return res.status(400).json({ message: 'Image must be an array of strings' });
        }


        const newProduct = new Product(req.body);
        await newProduct.save();

        res.status(201).json({
            message: "Product created successfully",
            data: newProduct
        });
    } catch (error) {
        next(error);
    }
};

//search product
const searchProducts = async (req, res, next) => {
    try {
        const { query } = req.query;


        const products = await Product.find({
            name: { $regex: query, $options: "i" }
        });

        // Trả về kết quả
        res.status(200).json(products);


    } catch (error) {
        next(error);
    }
};

//get feature product
const getTopSellingProducts = async (req, res, next) => {
    try {
        const topSellingProducts = await Product.find().sort({ numberOfSale: -1 }).limit(8) 
            .populate("category") // Populates thêm thông tin category nếu cần
            .exec();

        res.status(200).json({
            message: "Top 8 best-selling products",
            data: topSellingProducts
        });
    } catch (error) {
        next(error);
    }
};


const updateProduct = async (req, res, next) => {
    try {
        const productId = req.params.productId;
        const updatedFields = req.body; 

        const updatedProduct = await Product.findByIdAndUpdate(productId, updatedFields, { new: true, runValidators: true });
        
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });

    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        next(error);
    }
}

const deleteProduct = async (req, res) => {
    const productId = req.params.productId;
    try {
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
       next(error);
    }
};

module.exports = { getProducts, searchProducts, getProductByID, getRecommendedProducts, createNewProduct, updateProduct, deleteProduct, getTopSellingProducts };


