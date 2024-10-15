const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String
    },
    address: {
        type: String
    },
    avatar: {
        type: String
    },
    role: {
        type: String,        
        enum: ['USER', 'ADMIN'],
        default: 'USER'
    },
    token: {
        type: String
    },
    isActiveEmail: {
        type: Boolean,
        default: false
    },
    dateSignup: {
        type: Date,
        default: Date.now
    },
    birthday: {
        type: Date
    },
    statusAccount: {
        type: Number,
        default: 1 // 0: active, 1: suspended, etc.
    }
}, {
    timestamps: true // Automatically creates createdAt and updatedAt fields
});

const User = mongoose.model('User', userSchema);
module.exports = User;
