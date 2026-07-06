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
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    basePrice: {
        type: Number,
        required: true
    },
    variantGroups: [variantGroupSchema]
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
