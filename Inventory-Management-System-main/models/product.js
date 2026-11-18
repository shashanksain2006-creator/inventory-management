
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    sku: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    description: {
        type: String,
        default: ""
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    quantity: {
        type: Number,
        required: true,
        min: 0,
        validate: Number.isInteger
    },
    lowStockThreshold: {
        type: Number,
        default: 10,
        min: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Product", productSchema);
