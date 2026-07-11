const mongoose = require("mongoose");
const tenantIsolation = require("./plugins/tenantIsolation");

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
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true,
        index: true
    },
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

// Ensure product names are unique per restaurant
productSchema.index({ restaurantId: 1, name: 1 }, { unique: true });

productSchema.plugin(tenantIsolation);

module.exports = mongoose.model("Product", productSchema);
