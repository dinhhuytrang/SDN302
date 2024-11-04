const Category = require("../models/Category.model");

const getFeaturedCategories = async (req, res, next) => {
    try {
        const featuredCategories = await Category.find(); 
        res.status(200).json({
            message: "Featured categories",
            data: featuredCategories
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {getFeaturedCategories}