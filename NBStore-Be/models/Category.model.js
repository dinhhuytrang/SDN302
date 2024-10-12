const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String
    }
});

const Category = mongoose.model("category", categorySchema);
module.exports = Category;

