const mongoose = require("mongoose");

const variantOptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    priceAdjustment: {
        type: Number,
        default: 0
    }
});

const variantGroupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    options: [variantOptionSchema]
});

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    price: {
        type: Number,
        required: true
    },
    optionGroups: [variantGroupSchema]
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
